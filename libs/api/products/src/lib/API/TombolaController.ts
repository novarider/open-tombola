import { Application } from "express";
import { Service, Inject } from "typedi";
import { OrderRepository } from "../DAL/OrderRepository";
import { TicketRepository } from "../DAL/TicketRepository";
import { ITicketRepository } from "../DAL/ITicketRepository";
import { IOrderRepository } from "../DAL/IOrderRepository";

@Service()
export class TombolaController {
    @Inject('app')
    private app!: Application;

    @Inject(() => OrderRepository)
    private orderRepository!: IOrderRepository;

    @Inject(() => TicketRepository)
    private ticketRepository!: ITicketRepository;

    public registerRoutes() {
        /**
         * Example query to get all valid entries
         *      select orderid, firstname, lastname, weight, createdat, checkoutdoneat from 
         *          (select checkouts.fk_orderid, weight, checkoutdoneat from 
         *                  left join tickets on checkouts.fk_orderid = tickets.fk_orderid) as t1 left join orders on t1.fk_orderid = orders.orderid;
         */
        this.app.get('/tombola/tickets', async (req, res) => {
            try {
                const entries = await this.ticketRepository.getTickets();
                res.json(entries);
            } catch (e) {
                res.status(500).send('Error')
            }
        });

        this.app.get('/tombola/tickets/count', async (req, res) => {
            try {
                const entries = await this.ticketRepository.getTicketsCount();
                res.json(entries);
            } catch (e) {
                res.status(500).send('Error')
            }
        });

        this.app.get('/tombola/tickets/valid', async (_, res) => {
            try {
                const entries = await this.ticketRepository.getValidTickets();
                res.json(entries);
            } catch (e) {
                res.status(500).send('Error')
            }
        });

        this.app.get('/tombola/tickets/unpaid', async (req, res) => {
            try {
                res.json(await this.ticketRepository.getUnpaidTickets());
            } catch (e) {
                res.status(500).send(`Not implemlented.`);
            }
        });

        // todo use from order repository
        this.app.get('/tombola/orders/', async (req, res) => {
            try {
                const entries = await this.orderRepository.getOrders();
                res.json(entries);
            } catch (e) {
                res.status(500).send('Error')
            }
        });

        this.app.get('/tombola/orders/count', async (req, res) => {
            try {
                const entries = await this.orderRepository.getOrdersCount();
                res.json(entries);
            } catch (e) {
                res.status(500).send('Error')
            }
        });
    }
}