import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AeroportPage } from './aeroport.page';

describe('AeroportPage', () => {
  let component: AeroportPage;
  let fixture: ComponentFixture<AeroportPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AeroportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
