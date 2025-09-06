import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AeroportDetailsPage } from './aeroport-details.page';

describe('AeroportDetailsPage', () => {
  let component: AeroportDetailsPage;
  let fixture: ComponentFixture<AeroportDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AeroportDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
