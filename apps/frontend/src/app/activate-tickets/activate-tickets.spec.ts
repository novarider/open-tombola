import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivateTickets } from './activate-tickets';
import { provideRouter } from '@angular/router';

describe('ActivateTickets', () => {
  let component: ActivateTickets;
  let fixture: ComponentFixture<ActivateTickets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivateTickets],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivateTickets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
