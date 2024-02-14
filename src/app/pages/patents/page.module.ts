import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { Page } from "./page";
import { FilterPage } from "./filter/filter";
import { PageRoutingModule } from "./routing.module";
import { DetailModule } from "./detail/detail.module";
import { FormModule } from "./form/form.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailModule,
    FormModule,
    PageRoutingModule,
  ],
  exports: [DetailModule, FormsModule],
  declarations: [Page, FilterPage],
})
export class Module {}
