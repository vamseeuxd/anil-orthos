import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { Page } from "./page";
import { FilterPage } from "./filter/filter";
import { PageRoutingModule } from "./routing.module";
import { FormPage } from "./form/form";
import { DetailModule } from "../patents/detail/detail.module";

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
