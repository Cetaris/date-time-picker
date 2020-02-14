import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { OwlDateTimeModule, OWL_DATE_TIME_FORMATS } from '../../projects/picker/src/public_api';

import { AppComponent } from './app.component';
import { OwlMomentDateTimeModule } from 'projects/picker/src/lib/date-time/adapter/moment-adapter/moment-date-time.module';

export const MY_MOMENT_FORMATS = {
  parseInput: 'DD/MM/YYYY h:mm a',
  fullPickerInput: 'DD/MM/YYYY h:mm a',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'h:mm a',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, FormsModule,
    OwlDateTimeModule, OwlMomentDateTimeModule
  ],
  providers: [
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
