import { Component } from "@angular/core";

import { PopoverController } from "@ionic/angular";

import { PopoverPage } from "../about-popover/about-popover";

@Component({
  selector: "page-about",
  templateUrl: "about.html",
  styleUrls: ["./about.scss"],
})
export class AboutPage {
  location = "madison";
  conferenceDate = "2047-05-17";

  selectOptions = {
    header: "Select a Location",
  };

  constructor(public popoverCtrl: PopoverController) {}

  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: PopoverPage,
      event,
    });
    await popover.present();
  }

  navigateToServiceDetails(serviceType: string) {
    // Implement logic to navigate to the service details page here
    // This could involve using a navigation service or router
    console.log(`Opening service details for: ${serviceType}`);
  }
}
