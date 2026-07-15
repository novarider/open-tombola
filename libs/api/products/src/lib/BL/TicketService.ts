import { Inject, Service } from "typedi";
import { ITicketRepository } from "../DAL/ITicketOrder";
import { TicketRepository } from "../DAL/TicketRepository";
import { ActivationOrder, OfflineTicketValidateQuery, OrderActivationFailed, OrderActivationSucceeded } from "@novarider/open-tombola/models";
import { OrderService } from "./OrderService";
import * as QRCode from "qrcode";
import * as Papa from "papaparse";

const random = require("random-string-generator");

@Service()
export class TicketService {
    @Inject(() => TicketRepository)
    private ticketRepository!: ITicketRepository;

    @Inject(() => OrderService)
    private orderRepository!: OrderService;

    public async registerOfflineTickets(offlineOrder: ActivationOrder): Promise<OrderActivationFailed | OrderActivationSucceeded> {
        const activationInfo = await this.checkOfflineTicketAvailability(offlineOrder.offlineTickets.map(t => t.ticketId));

        if (activationInfo.allCodesFound === true && activationInfo.usedCodes.size === 0) {

            const order = await this.orderRepository.saveOrder(offlineOrder);

            const filledTickets = [];
            for (const ticket of offlineOrder.offlineTickets) {
                await this.ticketRepository.updateWeightOnTicket(ticket.ticketId, ticket.weight);
                filledTickets.push(await this.ticketRepository.updateOrderIdOnTicket(ticket.ticketId, order.orderid));
            }

            return {
                order: order,
                ticketIds: filledTickets
            }
        } else {
            return {
                unusedCodes: activationInfo.unusedCodes,
                usedCodes: activationInfo.usedCodes,
            }
        }
    }

    public async checkOfflineTicketAvailability(ticketIds: string[]): Promise<OfflineTicketValidateQuery> {
        const providedTickets = new Set(ticketIds);
        const foundTickets = new Set(await this.ticketRepository.getTicketsById(ticketIds));

        const eqSet = (xs: Set<unknown>, ys: Set<unknown>) =>
            xs.size === ys.size &&
            [...xs].every((x) => ys.has(x));

        const retVal: OfflineTicketValidateQuery = {
            allCodesFound: eqSet(providedTickets, foundTickets),
            unusedCodes: new Set<string>(),
            usedCodes: new Set<string>(),
        }

        for (const ticket of foundTickets) {
            if (ticket.fk_orderid === null) {
                retVal.unusedCodes.add(ticket.ticketid);
            } else {
                retVal.usedCodes.add(ticket.ticketid);
            }
        }

        return retVal;
    }

    public async updateOrderOnTickets(orderId: string, ticketId: string[]): Promise<void> {
        throw new Error(`Not implemented`)
    }

    public async createPrintTemplateCSV(): Promise<string> {
        const codes = await this.ticketRepository.getAvailbleOfflineTicketCodes();
        return Papa.unparse(codes.map(code => {
            const baseUrl = 'https://80-jahre-bergrettung.at/tickets/activate?code=';
            const fullUrl = baseUrl + code;
            const encodedFullUrl = encodeURIComponent(fullUrl)
            const qrCodeCellQuery = `=BILD("https://api.qrserver.com/v1/create-qr-code/?data=${encodedFullUrl}")`
            return { code: code, baseUrl: fullUrl, encodedUrl: encodedFullUrl, qrCodeQuery: qrCodeCellQuery };
        }));
    }

    public async createQRCodeForTicketCode(id: string): Promise<Buffer> {
        const baseUrl = `http://test.80-jahre-bergrettung.at/tickets/activate?code=${id ?? ''}`;

        return await QRCode.toBuffer(baseUrl);
    }

    public async createOfflineTicketCodes(toCreateAmount: number): Promise<void> {
        const arr: string[] = [];

        for (let i = 0; i < toCreateAmount; i++) {
            arr.push(random(6, "uppernumeric"))
        }

        await this.ticketRepository.createOfflineTicketCodes(arr);
    }

    public async getAvailbleOfflineTicketCodes(): Promise<string[]> {
        return await this.ticketRepository.getAvailbleOfflineTicketCodes();
    }
}