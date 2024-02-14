import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DetailPage } from './detail';

const routes: Routes = [
  {
    path: '',
    component: DetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailPageRoutingModule { }
