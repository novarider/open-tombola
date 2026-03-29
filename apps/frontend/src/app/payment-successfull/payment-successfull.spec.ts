import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentSuccessfull } from './payment-successfull';
import { provideRouter } from '@angular/router';

describe('PaymentSuccessfull', () => {
  let component: PaymentSuccessfull;
  let fixture: ComponentFixture<PaymentSuccessfull>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentSuccessfull],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentSuccessfull);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
