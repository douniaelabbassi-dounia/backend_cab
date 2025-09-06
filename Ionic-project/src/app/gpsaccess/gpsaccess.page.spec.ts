import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GPSAccessPage } from './gpsaccess.page';

describe('GPSAccessPage', () => {
  let component: GPSAccessPage;
  let fixture: ComponentFixture<GPSAccessPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GPSAccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
