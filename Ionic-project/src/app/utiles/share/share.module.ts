import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatetimePickerComponent } from '../component/dateTime/datetime-picker/datetime-picker.component';
import { TimePickerComponent } from '../component/dateTime/time-picker/time-picker.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { LongPressDirective } from '../directives/longpress/long-press.directive';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { ConfirmationComponent } from '../component/confirmation/confirmation.component';
import { WarningUpdateProffessionalInfoComponent } from '../component/warning-update-proffessional-info/warning-update-proffessional-info.component';
import { ImageSourceModalComponent } from '../component/image-source-modal/image-source-modal.component';
import { DeleteConfirmationComponent } from '../component/delete-confirmation/delete-confirmation.component';



@NgModule({
  declarations: [
    DatetimePickerComponent,
    TimePickerComponent,
    LongPressDirective,
    ConfirmationComponent,
    WarningUpdateProffessionalInfoComponent,
    ImageSourceModalComponent,
    DeleteConfirmationComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    
  ],
  exports:[ DatetimePickerComponent,
    TimePickerComponent,
    LongPressDirective,
    ConfirmationComponent,
    WarningUpdateProffessionalInfoComponent,
    ImageSourceModalComponent,
    DeleteConfirmationComponent

  ],
  providers:[Camera]
  
})
export class ShareModule { }
