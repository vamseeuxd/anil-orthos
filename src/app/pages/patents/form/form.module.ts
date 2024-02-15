import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormPage } from './form';
import { FormPageRoutingModule } from './form-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    FormPageRoutingModule
  ],
  declarations: [
    FormPage,
  ]
})
export class FormModule { }
