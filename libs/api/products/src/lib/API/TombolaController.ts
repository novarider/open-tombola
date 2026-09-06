import { Application } from "express";
import { Service, Inject } from "typedi";
import { OrderRepository } from "../DAL/OrderRepository";
import { TicketRepository } from "../DAL/TicketRepository";
import { ITicketRepository } from "../DAL/ITicketRepository";
import { IOrderRepository } from "../DAL/IOrderRepository";
import { TombolaService } from "../BL/TombolaService";
import { TombolaInput, TombolaResult } from "@novarider/open-tombola/models";
import { Request, Response } from "express";

@Service()
export class TombolaController {
    @Inject('app')
    private app!: Application;

    @Inject(() => OrderRepository)
    private orderRepository!: IOrderRepository;

    @Inject(() => TicketRepository)
    private ticketRepository!: ITicketRepository;

    @Inject(() => TombolaService)
    private tombolaService!: TombolaService;

    public registerRoutes() {
        /**
         * tickets are valid when
         *  - they have an existing order to them
         *  - order had been payed (checkoutdoneat is set)
         *      - checkout reference from stripe + checkoutstatus === complete
         *      - checkout reference 'offline' + checkoutdone date set
         *  - order had been created before end of tombola
         * 
         * Example query to get all valid entries (not finished)
         *      select orderid, firstname, lastname, weight, createdat, checkoutdoneat from 
         *          (select checkouts.fk_orderid, weight, checkoutdoneat from 
         *                  left join tickets on checkouts.fk_orderid = tickets.fk_orderid) as t1 left join orders on t1.fk_orderid = orders.orderid;
         * 
         * Get all payed checkouts
         *  select * from checkouts where checkoutdoneat IS NOT NULL and (paymentreference = 'offline' OR (paymentreference <> '' AND checkoutstatus = 'complete'));
         * 
         * Get all order ids sorted by absolute difference to weight
         *      SELECT t1.fk_orderid, weight, ABS(weight - 334.5) AS diff FROM 
         *          (SELECT fk_orderid FROM checkouts WHERE 
         *              checkoutdoneat IS NOT NULL AND 
         *              (paymentreference = 'offline' OR (paymentreference <> '' AND checkoutstatus = 'complete')
         *          )
         *      ) AS t1 LEFT JOIN tickets 
         *          ON t1.fk_orderid = tickets.fk_orderid 
         *          ORDER BY diff ASC;
         * 
         * Get calculated nearest ticket tips with order owner and address
         *      SELECT t2.diff, t2.weight, orders.firstname, orders.lastname, orders.street, orders.postalcode, orders.city, orders.country FROM
         *          (SELECT t1.fk_orderid, weight, ABS(weight - 3) AS diff FROM 
         *              (SELECT fk_orderid FROM checkouts WHERE 
         *                  checkoutdoneat IS NOT NULL AND 
         *                  (paymentreference = 'offline' OR (paymentreference <> '' AND checkoutstatus = 'complete')
         *              )
         *              ) AS t1 LEFT JOIN tickets 
         *              ON t1.fk_orderid = tickets.fk_orderid) AS t2 
         *                  LEFT JOIN orders 
         *                  ON t2.fk_orderid = orders.orderid 
         *                  ORDER BY diff ASC;
         * 
         * Function to do tombola result calculation
          
           CREATE OR REPLACE FUNCTION tombola_result(
                winningWeight real
                )
                RETURNS TABLE(
                    difference real,
                    guessed_weight real,
                    firstname varchar(50),
                    lastname varchar(50),
                    street varchar(50),
                    postalcode varchar(50),
                    city varchar(50),
                    country varchar(50)
                )
                AS $$
                BEGIN
                RETURN QUERY
                -- SQL_statements to be executed
                    SELECT t2.diff, t2.weight, orders.firstname, orders.lastname, orders.street, orders.postalcode, orders.city, orders.country FROM
                        (SELECT t1.fk_orderid, weight, ABS(weight - @winningWeight) AS diff FROM 
                            (SELECT fk_orderid FROM checkouts WHERE 
                                checkoutdoneat IS NOT NULL AND 
                                (paymentreference = 'offline' OR (paymentreference <> '' AND checkoutstatus = 'complete')
                            )
                            ) AS t1 LEFT JOIN tickets 
                            ON t1.fk_orderid = tickets.fk_orderid) AS t2 
                                LEFT JOIN orders 
                                ON t2.fk_orderid = orders.orderid 
                                ORDER BY diff ASC;
                END;$$
                LANGUAGE plpgsql;
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

        this.app.get('/tombola/result', async (req: Request, res: Response<TombolaResult | string>) => {
            try {
                const result = await this.tombolaService.calculateTombolaResult(req, res);
            } catch (e) {
                res.status(500).send('Error')
            }
        });
    }
}