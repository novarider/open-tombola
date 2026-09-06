import { TombolaInput, TombolaResultEntry } from "@novarider/open-tombola/models";

export interface ITombolaRepository {
    calculateTombolaResult(input: TombolaInput): Promise<TombolaResultEntry[]>;
}