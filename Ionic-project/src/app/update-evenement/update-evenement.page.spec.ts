import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateEvenementPage } from './update-evenement.page';

describe('UpdateEvenementPage', () => {
  let component: UpdateEvenementPage;
  let fixture: ComponentFixture<UpdateEvenementPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UpdateEvenementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
