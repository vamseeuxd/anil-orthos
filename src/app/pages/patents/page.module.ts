import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { Page } from "./page";
import { FilterPage } from "./filter/filter";
import { PageRoutingModule } from "./routing.module";
import { DetailModule } from "./detail/detail.module";
import { FormPage } from "./form/form";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailModule,
    FormPage,
    PageRoutingModule,
  ],
  exports: [DetailModule, FormsModule],
  declarations: [Page, FilterPage],
})
export class Module {}
