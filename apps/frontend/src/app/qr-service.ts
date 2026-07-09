import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class QrService {
    private _onTicketIdIdentified: Subject<string | undefined> = new Subject<string | undefined>();
    public onSuccessfullScan: Observable<string | undefined> = this._onTicketIdIdentified.asObservable();

    private _onInvalidDataIdentified: Subject<string | undefined> = new Subject<string | undefined>();
    public onInvalidDataIdentified: Observable<string | undefined> = this._onInvalidDataIdentified.asObservable();

    public tryParseQrCode(qrCode: string): void {
        // qrCode string must be validated to be a url + ticket id if not discard it.
        // todo parsing logic
        if (this.validateQrCodeContent(qrCode)) {
            this._onTicketIdIdentified.next(qrCode);
        } else {
            this._onInvalidDataIdentified.next(qrCode);
        }
    }

    public validateQrCodeContent(content: string): boolean {
        const staticUrlPart = 'https://80-jahre-bergrettung.at/tickets/activate?ticketId=';

        if (!content.startsWith(staticUrlPart)) {
            return false;
        }

        content = content.replace(staticUrlPart, '');
        return content.length === 36; // check if the remaining string is a valid UUID
    }
}