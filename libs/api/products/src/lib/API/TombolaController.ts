import { Application } from "express";
import { Service, Inject } from "typedi";
import { DBConnection } from "../DAL/DBConnection";

@Service()
export class TombolaController {
    @Inject('app')
    private app: Application;

    @Inject(() => DBConnection)
    private db: DBConnection;

    public registerRoutes() {
        /**
         * Example query to get all valid entries
         *      select orderid, firstname, lastname, weight, createdat, checkoutdoneat from 
         *          (select checkouts.fk_orderid, weight, checkoutdoneat from 
         *              (select fk_orderid, checkoutdoneat from checkouts where checkoutstatus = 'complete') as checkouts 
         *                  left join tickets on checkouts.fk_orderid = tickets.fk_orderid) as t1 left join orders on t1.fk_orderid = orders.orderid;
         */
        this.app.post('/tombola/entries', async (req, res) => {
            const entries = await this.db.dbOpenTombola.manyOrNone("SELECT * FROM tickets");
            res.json(entries);
        });

        this.app.post('/tombola/entries/valid', async (req, res) => {
            res.status(500).send(`Not implemlented.`);
        });

        this.app.post('/tombola/entries/unpaid', async (req, res) => {
            res.status(500).send(`Not implemlented.`);
        });
    }
}