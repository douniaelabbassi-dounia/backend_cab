import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PremiumConfirmationPage } from './premium-confirmation.page';

describe('PremiumConfirmationPage', () => {
  let component: PremiumConfirmationPage;
  let fixture: ComponentFixture<PremiumConfirmationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PremiumConfirmationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
