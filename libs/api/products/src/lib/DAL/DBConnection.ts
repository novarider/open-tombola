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
    public db;

    public async connect() {
        this.db = this.pgp(`postgres://${this.dbUsername}:${this.dbPassword}@${this.dbHost}:${this.dbPort}/postgres`);
        await this.db.connect();
    }

    public close() {
        this.pgp.end();
    }
}