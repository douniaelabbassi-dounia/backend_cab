import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PubPage } from './pub.page';

describe('PubPage', () => {
  let component: PubPage;
  let fixture: ComponentFixture<PubPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
