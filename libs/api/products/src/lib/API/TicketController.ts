import { Application, Request } from "express";
import { Service, Inject } from "typedi";
import { ActivationOrder } from "@novarider/open-tombola/models";
import { TicketService } from "../BL/TicketService";

interface OfflineTicketActivationRequest extends Request {
    body: ActivationOrder
}

@Service()
export class TicketController {
    @Inject('app')
    private app: Application;

    @Inject(() => TicketService)
    private ticketService: TicketService;

    public registerRoutes() {
        this.app.get('/tickets/offline/codes', async (req, res) => {
            try {
                const codes = await this.ticketService.getAvailbleOfflineTicketCodes();
                res.status(200).json(codes);
            } catch {
                res.status(500).json([]);
            }
        });

        this.app.get('/tickets/offline/codes/csv', async (req, res) => {
            try {
                const retVal = await this.ticketService.createPrintTemplateCSV();
                res.status(200).send(retVal);
            } catch (e) {
                console.error(e)
                res.status(500).send('Error');
            }
        });

        this.app.post('/tickets/offline/create', async (req, res) => {
            try {
                if (req.body.amount > 10000) {
                    res.status(400).send('Generating more than 10 000 codes not supported.')
                }

                const retVal = await this.ticketService.createOfflineTicketCodes(req.body.amount);

                res.status(200).json(retVal);
            } catch (e) {
                res.status(500).send('Error');
            }
        });

        this.app.post('/tickets/offline/qr/:id', async (req, res) => {
            try {
                const retVal = await this.ticketService.createQRCodeForTicketCode(req.params.id);

                res.status(200).send(retVal);
            } catch (e) {
                res.status(500).send('Error');
            }
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