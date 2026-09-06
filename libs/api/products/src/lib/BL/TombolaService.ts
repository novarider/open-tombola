import { Service, Inject } from "typedi";
import { ITicketRepository } from "../DAL/ITicketRepository";
import { TicketRepository } from "../DAL/TicketRepository";
import { Request, Response } from "express";
import { TombolaInput, TombolaResult } from "@novarider/open-tombola/models";
import { TombolaRepository } from "../DAL/TombolaRepository";
import { ITombolaRepository } from "../DAL/ITombolaRepository";
import { ValidationError } from "./ValidationError";

@Service()
export class TombolaService {
    @Inject(() => TombolaRepository)
    private tombolaRepository!: ITombolaRepository;

    public async calculateTombolaResult(req: Request, res: Response<TombolaResult>): Promise<void> {
        try {
            const actualWeight: number = this.validateWeightInput(req);

            const result = await this.tombolaRepository.calculateTombolaResult({ weight: actualWeight });
            res.json({
                actualWeight,
                result
            });
        } catch (e) {
            console.error(e);
            if (e instanceof ValidationError) {
                this.returnValidationError(res, e);
            } else {
                this.returnServerError(res);
            }
        }
    }

    private returnServerError(res: Response) {
        res.status(500);
    }

    private returnValidationError(res: Response, err: ValidationError) {
        res.status(400).json(err);
    }

    private validateWeightInput(req: Request) {
        const { weight } = req.query;
        const retVal = Number.parseFloat(weight?.toString() ?? '');

        if (Number.isNaN(retVal)) {
            throw new ValidationError(`Weight must be a number`);
        }

        return retVal;
    }
}