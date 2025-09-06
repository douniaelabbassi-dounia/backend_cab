import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AidePage } from './aide.page';

describe('AidePage', () => {
  let component: AidePage;
  let fixture: ComponentFixture<AidePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
