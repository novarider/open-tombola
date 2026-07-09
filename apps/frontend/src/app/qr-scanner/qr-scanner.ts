import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Html5Qrcode } from "html5-qrcode";
import { QrService } from '../qr-service';

@Component({
  selector: 'app-qr-scanner',
  imports: [],
  templateUrl: './qr-scanner.html',
  styleUrl: './qr-scanner.css',
})
export class QrScanner implements OnInit, OnDestroy {
  private html5Qrcode: Html5Qrcode | undefined;
  private qrService: QrService = inject(QrService);

  public ngOnInit() {
    // more info: https://scanapp.org/html5-qrcode-docs/docs/intro
    this.html5Qrcode = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: { width: 500, height: 500 } };

    this.html5Qrcode.start(
      { facingMode: "environment" },
      config,
      (decodedText) => this.qrService.tryParseQrCode(decodedText),
      () => {
        // todo log error if needed
      }
    ).catch(() => {
      // if user permissions fails show initial screen again
      const modal = document.getElementById("camera-permission-info");
      modal?.addEventListener("toggle", (e)=> {
        if(e.newState === "closed") {
          navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          this.qrService.tryParseQrCode("permission");
        }
      });
      modal?.showPopover();
    })
  }

  public ngOnDestroy() {
    if (this.html5Qrcode?.isScanning) {
      this.html5Qrcode?.stop().catch((err) => {
        console.error("Failed to stop html5Qrcode", err);
      });
    }
  }
}
