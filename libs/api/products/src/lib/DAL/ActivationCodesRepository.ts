import { Inject, Service } from "typedi";
import { IActivationCodesRepository } from "./IActivationCodesRepository";
import { DBConnection } from "./DBConnection";


@Service()
export class ActivationCodesRepository implements IActivationCodesRepository {
    @Inject(() => DBConnection)
    private dbConnection!: DBConnection;

    public async createOfflineTicketCodes(codes: string[]): Promise<void> {
        try {
            await this.dbConnection.dbOpenTombola.tx(async (tx) => {
                for (const code of codes) {
                    await tx.none("INSERT INTO offlineTicketCodes (code, used) VALUES ($1, $2)", [code, false]);
                }
            });
        } catch (error) {
            console.error("Error creating new ticket codes:", error);
        }
    }

    public async getAvailbleOfflineTicketCodes(): Promise<string[]> {
        const dbResult = await this.dbConnection.dbOpenTombola.manyOrNone<{ code: string }>("SELECT code FROM offlineTicketCodes WHERE used = false");
        return dbResult.map(c => c.code);
    }

    public async findAvailableActivationCode(code?: string | null): Promise<boolean> {
        if (!code) {
            return false;
        }

        const dbResult = await this.dbConnection.dbOpenTombola.oneOrNone<{ code: string }>("SELECT code FROM offlineTicketCodes WHERE used = false AND code = $1", code);

        return dbResult !== null;
    }

    public async markCodesAsUsed(codes: (string | null | undefined)[]): Promise<boolean> {
        for (const code of codes) {
            if (!code) {
                return false;
            }

            await this.dbConnection.dbOpenTombola.oneOrNone<{ code: string }>("UPDATE offlineTicketCodes SET used = true WHERE code = $1", code);
        }

        return true;
    }
}