import { Component } from "@angular/core";

import { ActivatedRoute } from "@angular/router";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "patent-form",
  styleUrls: ["./form.scss"],
  templateUrl: "form.html",
})
export class FormPage {
  form: any;
  isFavorite = false;
  defaultHref = "";
  model: any = {}; // Object to hold form data

  patentForm: FormGroup;

  constructor(private route: ActivatedRoute) {}

  ionViewWillEnter() {
    const patentId = this.route.snapshot.paramMap.get("patentId");
  }

  onSubmit() {
    // Handle form submission, e.g., send data to backend
    console.log("Form submitted:", this.model);
  }

  ionViewDidEnter() {
    this.defaultHref = `/app/tabs/patents`;
  }
}
