import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormPage } from './form';
import { FormPageRoutingModule } from './form-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteComponent } from '../../../shared/auto-complete/auto-complete.component';
import { CountryStateCityComponent } from '../../../shared/country-state-city/country-state-city.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    CountryStateCityComponent,
    FormPageRoutingModule,
    AutoCompleteComponent,
  ],
  declarations: [
    FormPage,
  ]
})
export class FormModule { }
