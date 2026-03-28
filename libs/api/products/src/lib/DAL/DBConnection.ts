import { Inject, Service } from "typedi";
import pgpromise = require('pg-promise');
import { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD } from "../env";


@Service()
export class DBConnection {
    @Inject(DB_HOST)
    private dbHost!: string;

    @Inject(DB_PORT)
    private dbPort!: string;

    @Inject(DB_USERNAME)
    private dbUsername!: string;

    @Inject(DB_PASSWORD)
    private dbPassword!: string;

    private pgp = pgpromise({});
    private dbPostgres: pgpromise.IDatabase<unknown>;
    public dbOpenTombola: pgpromise.IDatabase<unknown>;

    public async connect() {
        this.dbPostgres = await this.pgp(`postgres://${this.dbUsername}:${this.dbPassword}@${this.dbHost}:${this.dbPort}/postgres`);
        this.dbOpenTombola = await this.pgp(`postgres://${this.dbUsername}:${this.dbPassword}@${this.dbHost}:${this.dbPort}/open_tombola`);
    }

    private async createDBIfNotExists(): Promise<void> {
        const databases = await this.dbPostgres.any(`SELECT datname FROM pg_database WHERE datname = 'open_tombola';`);
        console.debug(JSON.stringify(databases));
        if (databases.length === 0) {
            await this.dbPostgres.any(`CREATE DATABASE open_tombola;`);
            console.info(`Database 'open_tombola' created successfully.`);
        } else {
            console.info(`Using existing database 'open_tombola'.`);
        }
    }

    private async createOrdersTableIfNotExists(): Promise<void> {
        await this.dbOpenTombola.query(`CREATE TABLE IF NOT EXISTS orders (
                orderid varchar(36) primary key,
                firstname varchar(100),
                lastname varchar(100),
                street varchar(100),
                addressline2 varchar(100),
                postalcode varchar(100),
                city varchar(100),
                country varchar(100),
                createdat timestamp
            );`);
        console.log(`Table orders ready to use.`);
    }

    private async createTicketsTableIfNotExists(): Promise<void> {
        await this.dbOpenTombola.any(`CREATE TABLE IF NOT EXISTS tickets (
                ticketid varchar(36) primary key,
                fk_orderid varchar(36) references orders (orderId),
                weight real NOT NULL
            );`);
        console.log(`Table tickets ready to use.`);
    }

    private async createCheckoutsTableIfNotExists(): Promise<void> {
        await this.dbOpenTombola.any(`CREATE TABLE IF NOT EXISTS checkouts (
                checkoutid serial primary key,
                checkoutstatus varchar(30),
                checkoutdoneat timestamp,
                fk_orderid varchar(36) references orders (orderId),
                paymentreference varchar(255),
                paymentstatus varchar(30)
            );`);
        console.log(`Table checkouts ready to use.`);
    }

    private async createOfflineTicketsTableIfNotExists(): Promise<void> {
        await this.dbOpenTombola.any(`CREATE TABLE IF NOT EXISTS offlineTicketCodes (
                code varchar(6) primary key,
                used boolean
            );`);
        console.log(`Table offlineTicketCodes ready to use.`);
    }

    public async prepareOpenTombolaDB() {
        // todo check if order table exists, if not create it
        await this.createDBIfNotExists();
        await this.createOrdersTableIfNotExists();
        await this.createTicketsTableIfNotExists();
        await this.createCheckoutsTableIfNotExists();
        await this.createOfflineTicketsTableIfNotExists();
    }

    public close() {
        this.pgp.end();
    }
}