import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MentionLegalPage } from './mention-legal.page';

describe('MentionLegalPage', () => {
  let component: MentionLegalPage;
  let fixture: ComponentFixture<MentionLegalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MentionLegalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
