import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateProfilPage } from './update-profil.page';

describe('UpdateProfilPage', () => {
  let component: UpdateProfilPage;
  let fixture: ComponentFixture<UpdateProfilPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UpdateProfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
