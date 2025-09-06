import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AeroportModalPage } from './aeroport-modal.page';

describe('AeroportModalPage', () => {
  let component: AeroportModalPage;
  let fixture: ComponentFixture<AeroportModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AeroportModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
