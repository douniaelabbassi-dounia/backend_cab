import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThanksPagePage } from './thanks-page.page';

describe('ThanksPagePage', () => {
  let component: ThanksPagePage;
  let fixture: ComponentFixture<ThanksPagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ThanksPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
