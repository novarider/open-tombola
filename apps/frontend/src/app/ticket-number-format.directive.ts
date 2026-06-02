import { Directive, ElementRef, HostListener, inject, LOCALE_ID, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { formatNumber } from '@angular/common';

@Directive({
    selector: '[appTicketNumberFormat]'
})
export class TicketNumberFormatDirective implements OnInit {
    private el = inject(ElementRef);
    private control = inject(NgControl);
    private locale = inject(LOCALE_ID);

    ngOnInit() {
        // Format the initial value loaded into the form
        setTimeout(() => this.formatValue());
    }

    @HostListener('blur')
    onBlur() {
        this.formatValue();
    }

    private formatValue() {
        const value = this.control.value;
        const cleanValue = value.toString().replace(/,/g, '.');
        if (cleanValue !== null && cleanValue !== undefined && !isNaN(cleanValue)) {
            const formatted = formatNumber(Number(cleanValue), this.locale, '1.3-10');
            this.el.nativeElement.value = formatted;
        }
    }
}