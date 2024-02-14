import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormPage } from './form';
import { FormPageRoutingModule } from './form-routing.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormPageRoutingModule
  ],
  declarations: [
    FormPage,
  ]
})
export class FormModule { }
