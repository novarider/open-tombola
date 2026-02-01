import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentCancelled } from './payment-cancelled';

describe('PaymentCancelled', () => {
  let component: PaymentCancelled;
  let fixture: ComponentFixture<PaymentCancelled>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentCancelled],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentCancelled);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
