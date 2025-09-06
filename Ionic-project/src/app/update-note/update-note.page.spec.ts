import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateNotePage } from './update-note.page';

describe('UpdateNotePage', () => {
  let component: UpdateNotePage;
  let fixture: ComponentFixture<UpdateNotePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UpdateNotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
