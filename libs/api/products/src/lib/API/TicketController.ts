import { Application } from "express";
import { Service, Inject } from "typedi";

@Service()
export class TicketController {
    @Inject('app')
    private app: Application;

    public registerRoutes() {
        this.app.post('/tickets/create', async (req, res) => {
            res.status(500).send(`Not implemlented.`);
        });
    }
}