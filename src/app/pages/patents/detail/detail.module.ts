import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailPage } from './detail';
import { DetailPageRoutingModule } from './detail-routing.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    DetailPageRoutingModule
  ],
  declarations: [
    DetailPage,
  ]
})
export class DetailModule { }
