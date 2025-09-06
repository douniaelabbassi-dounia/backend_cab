import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WarningUpdateProffessionalInfoComponent } from './warning-update-proffessional-info.component';

describe('WarningUpdateProffessionalInfoComponent', () => {
  let component: WarningUpdateProffessionalInfoComponent;
  let fixture: ComponentFixture<WarningUpdateProffessionalInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningUpdateProffessionalInfoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WarningUpdateProffessionalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
