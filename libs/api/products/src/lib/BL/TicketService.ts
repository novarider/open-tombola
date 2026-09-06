import { Inject, Service } from "typedi";
import { ITicketRepository } from "../DAL/ITicketRepository";
import { TicketRepository } from "../DAL/TicketRepository";
import { ActivationOrder, OrderActivationSucceeded, Ticket, TicketDBO } from "@novarider/open-tombola/models";
import { OrderService } from "./OrderService";
import * as QRCode from "qrcode";
import * as Papa from "papaparse";
import { Request, Response } from "express";
import { ActivationCodesRepository } from "../DAL/ActivationCodesRepository";
import { IActivationCodesRepository } from "../DAL/IActivationCodesRepository";
import { v7 as uuid } from "uuid";
import { ValidationError } from "./ValidationError";

const random = require("random-string-generator");

interface OfflineTicketActivationRequest extends Request {
    body: ActivationOrder
}

@Service()
export class TicketService {
    @Inject(() => TicketRepository)
    private ticketRepository!: ITicketRepository;

    @Inject(() => OrderService)
    private orderService!: OrderService;

    @Inject(() => ActivationCodesRepository)
    private activationCodesRepository!: IActivationCodesRepository;

    public async activateOfflineTicketsHandler(req: OfflineTicketActivationRequest, res: Response<unknown>): Promise<void> {
        try {
            this.validatePersonalData(req, res);
            this.validateTicketData(req, res);
            // submitted data have correct values
            console.log(`Submitted data validated`)

            const data = req.body;

            for (const t of data.offlineTickets) {
                if (!await this.activationCodesRepository.findAvailableActivationCode(t.activationCode)) {
                    throw new ValidationError(`Invalid activation code on ticket`);
                }
            }
            // all codes are valid and available for redeeming
            console.debug(`All Codes are valid and not redeemed`)

            const order = await this.orderService.saveOrder({
                addressLine2: data.addressLine2,
                city: data.city,
                country: data.country,
                firstName: data.firstName,
                lastName: data.lastName,
                phonenumber: data.phonenumber,
                postalCode: data.postalCode,
                street: data.street,
            });

            const tickets = await this.saveTickets(data.offlineTickets.map(t => ({
                weight: t.weight
            })), order.orderid);
            console.debug(`Order and tickets created`)

            await this.orderService.markOfflineOrderAsPayed(order.orderid);
            console.debug(`Order marked as payed`)

            await this.activationCodesRepository.markCodesAsUsed(data.offlineTickets.map(t => t.activationCode));
            // order + tickets created and codes are marked as used
            console.debug(`Codes redeemed`)

            const retVal: OrderActivationSucceeded = {
                order: order,
                ticketIds: tickets
            }
            res.status(200).json(retVal);
        } catch (e) {
            console.error(e);
            if (e instanceof ValidationError) {
                this.returnValidationError(res, e);
            } else {
                this.returnServerError(res);
            }
        }
    }

    private returnValidationError(res: Response, err: ValidationError) {
        res.status(400).json(err);
    }

    private returnServerError(res: Response) {
        res.status(500);
    }

    private validatePersonalData(req: OfflineTicketActivationRequest, res: Response<unknown, Record<string, any>>) {
        const checkStringConstraints = (str: string): boolean =>
            req.body.firstName.length === 0 || req.body.firstName.length > 50

        if (checkStringConstraints(req.body.firstName)) {
            throw new ValidationError(`Invalid firstname (length: 0 < x < 50)`);
        }

        if (checkStringConstraints(req.body.lastName)) {
            throw new ValidationError(`Invalid lastname (length: 0 < x < 50)`);
        }

        if (checkStringConstraints(req.body.street)) {
            throw new ValidationError(`Invalid street (length: 0 < x < 50)`);
        }

        if (checkStringConstraints(req.body.addressLine2)) {
            throw new ValidationError(`Invalid addressline2 (length: 0 < x < 50)`);
        }

        if (checkStringConstraints(req.body.postalCode)) {
            throw new ValidationError(`Invalid postalcode (length: 0 < x < 50)`);
        }

        if (checkStringConstraints(req.body.city)) {
            throw new ValidationError(`Invalid city (length: 0 < x < 50)`);
        }

        if (checkStringConstraints(req.body.country)) {
            throw new ValidationError(`Invalid country (length: 0 < x < 50)`);
        }

        if (checkStringConstraints(req.body.phonenumber)) {
            throw new ValidationError(`Invalid phonenumber (length: 0 < x < 50)`);
        }
    }

    private validateTicketData(req: OfflineTicketActivationRequest, res: Response) {
        if (req.body.offlineTickets.length === 0) {
            throw new ValidationError(`No activation codes present`);
        }

        for (const t of req.body.offlineTickets) {
            if (!t.activationCode) {
                throw new ValidationError(`No activation code on ticket`);
            };

            if (t.activationCode.length !== 6) {
                throw new ValidationError(`Invalid activation code on ticket`);
            }

            if (!t.weight) {
                throw new ValidationError(`No weight on ticket`);
            };

            if (!Number.isFinite(Number.parseFloat(t.weight)) || Number(t.weight) < 0.001) {
                throw new ValidationError(`Invalid weight on ticket`);
            };
        }
    }

    public async createPrintTemplateCSV(): Promise<string> {
        const codes = await this.activationCodesRepository.getAvailbleOfflineTicketCodes();
        return Papa.unparse(codes.map(code => {
            const baseUrl = 'https://80-jahre-bergrettung.at/tickets/activate?code=';
            const fullUrl = baseUrl + code;
            const encodedFullUrl = encodeURIComponent(fullUrl)
            const qrCodeCellQuery = `=BILD("https://api.qrserver.com/v1/create-qr-code/?data=${encodedFullUrl}")`
            return { code: code, baseUrl: fullUrl, encodedUrl: encodedFullUrl, qrCodeQuery: qrCodeCellQuery };
        }));
    }

    public async createQRCodeForTicketCode(id: string): Promise<Buffer> {
        const baseUrl = `https://80-jahre-bergrettung.at/tickets/activate?code=${id ?? ''}`;

        return await QRCode.toBuffer(baseUrl);
    }

    public async createOfflineTicketCodes(toCreateAmount: number): Promise<void> {
        const arr: string[] = [];

        for (let i = 0; i < toCreateAmount; i++) {
            arr.push(random(6, "uppernumeric"))
        }

        await this.activationCodesRepository.createOfflineTicketCodes(arr);
    }

    public async getAvailbleOfflineTicketCodes(): Promise<string[]> {
        return await this.activationCodesRepository.getAvailbleOfflineTicketCodes();
    }

    public async saveTickets(tickets: Ticket[], orderId: string): Promise<TicketDBO[]> {
        const dbTickets = await this.ticketRepository.saveTickets(
            tickets.map(t => ({
                fk_orderid: orderId,
                ticketid: uuid(),
                weight: Number.parseFloat(t.weight)
            }))
        );
        console.debug(`Saved Tickets ${tickets.length} to order ${orderId}...`);
        return dbTickets;
    }
}