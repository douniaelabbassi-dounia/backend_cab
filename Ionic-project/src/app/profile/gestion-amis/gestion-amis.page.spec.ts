import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionAmisPage } from './gestion-amis.page';

describe('GestionAmisPage', () => {
  let component: GestionAmisPage;
  let fixture: ComponentFixture<GestionAmisPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GestionAmisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
