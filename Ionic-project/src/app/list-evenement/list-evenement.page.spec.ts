import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListEvenementPage } from './list-evenement.page';

describe('ListEvenementPage', () => {
  let component: ListEvenementPage;
  let fixture: ComponentFixture<ListEvenementPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListEvenementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
