export class ValidationError extends Error {
    public validationError: string;
    constructor(msg: string) {
        super(msg);
        this.validationError = msg;
    }
}
