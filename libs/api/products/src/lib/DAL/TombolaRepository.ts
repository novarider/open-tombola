import { TombolaInput, TombolaResult, TombolaResultEntry } from "@novarider/open-tombola/models";
import { DBConnection } from "./DBConnection";
import { Inject, Service } from "typedi";
import { ITombolaRepository } from "./ITombolaRepository";

@Service()
export class TombolaRepository implements ITombolaRepository {
    @Inject(() => DBConnection)
    private dbConnection!: DBConnection;

    public async calculateTombolaResult(input: TombolaInput): Promise<TombolaResultEntry[]> {
        return await this.dbConnection.dbOpenTombola.manyOrNone<TombolaResultEntry>("SELECT * FROM tombola_result($1)", [input.weight]);
    }
}