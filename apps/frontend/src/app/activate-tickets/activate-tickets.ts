import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { QrScanner } from "../qr-scanner/qr-scanner";
import { QrService } from '../qr-service';

/**
 * scanning works so far, also with url validation
 * 
 * todo
 * - add multiple tickets to page with one scan
 * - add error handling + message for users which deny camera access (fix button possible button switching without message)
 */

@Component({
  selector: 'app-activate-tickets',
  imports: [QrScanner],
  templateUrl: './activate-tickets.html',
  styleUrl: './activate-tickets.css',
})
export class ActivateTickets implements OnInit {
  public showScanner: WritableSignal<boolean> = signal(false);
  public showScanningError: WritableSignal<boolean> = signal(false);
  private qrService: QrService = inject(QrService);

  public tickets: Set<string> = new Set<string>();

  public startScanning() {
    this.showScanningError.set(false);
    this.showScanner.set(true);
  }

  public ngOnInit(): void {
    this.qrService.onSuccessfullScan.subscribe((qrCode?: string) => {
      if (qrCode) {
        this.showScanner.set(false);
        this.tickets.add(qrCode);
      }
    });

    this.qrService.onInvalidDataIdentified.subscribe((qrCode?: string) => {
      console.log(qrCode);
      if (qrCode) {
        this.showScanner.set(false);
        this.showScanningError.set(true);
      }
    });
  }

  public submitTickets() {
    // todo 
    // 1. check if tickets are valid and not already activated
    // 2. gather user information 
    // 3. submit both to backend to register
  }
}
