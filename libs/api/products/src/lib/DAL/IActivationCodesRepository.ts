export interface IActivationCodesRepository {
    createOfflineTicketCodes(codes: string[]): Promise<void>;
    getAvailbleOfflineTicketCodes(): Promise<string[]>;
    findAvailableActivationCode(code?: string | null): Promise<boolean>;
    markCodesAsUsed(codes: (string | null | undefined)[]): Promise<boolean>;
}