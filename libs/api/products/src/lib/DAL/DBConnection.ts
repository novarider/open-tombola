import { Inject, Service } from "typedi";
import pgpromise from "pg-promise";

@Service()
export class DBConnection {
    @Inject("db-host")
    private dbHost!: string;

    @Inject("db-port")
    private dbPort!: string;

    @Inject("db-username")
    private dbUsername!: string;

    @Inject("db-password")
    private dbPassword!: string;

    private pgp = pgpromise({});
    private dbPostgres;
    public dbOpenTombola;

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
        await this.dbOpenTombola.any(`CREATE TABLE IF NOT EXISTS orders (
                orderId varchar(36) primary key,
                firstname varchar(100),
                lastname varchar(100),
                street varchar(100),
                addressLine2 varchar(100),
                postalCode varchar(100),
                city varchar(100),
                country varchar(100),
                createdAt timestamp,
                payedAt timestamp
            );`);
        console.log(`Table orders ready to use.`);
    }

    private async createTicketsTableIfNotExists(): Promise<void> {
        await this.dbOpenTombola.any(`CREATE TABLE IF NOT EXISTS tickets (
            ticketId varchar(36) primary key,
            fk_orderId varchar(36) references orders (orderId),
            weight real NOT NULL
            );`);
        console.log(`Table tickets ready to use.`);
    }

    public async prepareOpenTombolaDB() {
        // todo check if order table exists, if not create it
        await this.createDBIfNotExists();
        await this.createOrdersTableIfNotExists();
        await this.createTicketsTableIfNotExists();
    }

    public close() {
        this.pgp.end();
    }
}