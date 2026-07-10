import { Application, Request } from "express";
import { Service, Inject } from "typedi";
import * as QRCode from "qrcode";
import { TicketRepository } from "../DAL/TicketRepository";
import { ITicketRepository } from "../DAL/ITicketOrder";
import { ActivationOrder } from "@novarider/open-tombola/models";
import { TicketService } from "../BL/TicketService";

const random = require("random-string-generator");

interface OfflineTicketActivationRequest extends Request {
    body: ActivationOrder
}

@Service()
export class TicketController {
    @Inject('app')
    private app: Application;

    @Inject(() => TicketRepository)
    private ticketRepository: ITicketRepository;

    @Inject(() => TicketService)
    private ticketService: TicketService;

    public registerRoutes() {
        this.app.get('/tickets/offline/codes', async (req, res) => {
            try {
                const codes = await this.ticketRepository.getAvailbleOfflineTicketCodes();
                res.status(200).json(codes);
            } catch {
                res.status(500).json([]);
            }
        });

        this.app.post('/tickets/offline/create', async (req, res) => {
            const toCreateAmount: number = req.body.amount;
            const arr: string[] = [];

            for (let i = 0; i < toCreateAmount; i++) {
                arr.push(random(6, "uppernumeric"))
            }

            await this.ticketRepository.createOfflineTicketCodes(arr);

            res.status(200).json(arr);
        });

        this.app.post('/tickets/offline/qr/[id]', async (req, res) => {
            const baseUrl = "http://test.80-jahre-bergrettung.at/tickets/activate";

            const dataString = await QRCode.toDataURL(baseUrl);

            res.status(200).json(dataString);
        });

        this.app.post('/tickets/offline/activate', async (req: OfflineTicketActivationRequest, res) => {
            try {
                await this.ticketService.registerOfflineTickets(req.body);
            } catch (e) {
                res.status(500).send('Error');
            }
        });
    }
}