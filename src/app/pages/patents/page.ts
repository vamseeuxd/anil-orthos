import { Component, ViewChild, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import {
  AlertController,
  IonList,
  IonRouterOutlet,
  LoadingController,
  ModalController,
  ToastController,
  Config,
} from "@ionic/angular";

import { FilterPage } from "./filter/filter";
import { ConferenceData } from "../../providers/conference-data";
import { UserData } from "../../providers/user-data";
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { IPatent } from "./IPatent";

@Component({
  selector: "page-patents",
  templateUrl: "page.html",
  styleUrls: ["./page.scss"],
})
export class Page implements OnInit {
  // Gets a reference to the list element
  @ViewChild("scheduleList", { static: true }) scheduleList: IonList;

  firestore: Firestore = inject(Firestore);
  patentsCollection = collection(this.firestore, "patents");
  patents$: Observable<IPatent[]> = collectionData(this.patentsCollection, {
    idField: "id",
  }) as Observable<IPatent[]>;

  ios: boolean;
  queryText = "";
  excludeTracks: any = [];
  showSearchbar: boolean;

  constructor(
    public alertCtrl: AlertController,
    public confData: ConferenceData,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    public toastCtrl: ToastController,
    public user: UserData,
    public config: Config
  ) {}

  ngOnInit() {
    this.ios = this.config.get("mode") === "ios";
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: "Please wait...",
      duration: null,
    });
    loading.present();
    return loading;
  }

  async deletePatent(slidingItem: HTMLIonItemSlidingElement, patentId: string) {
    const alert = await this.alertCtrl.create({
      header: "Delete Confirmatiom",
      message: "Would you like to delete this Patent?",
      buttons: [
        {
          text: "Cancel",
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          },
        },
        {
          text: "Delete",
          handler: async () => {
            const loading = await this.showLoading();
            const patentDocRef = doc(
              this.firestore,
              `${this.patentsCollection.path}/${patentId}`
            );
            await deleteDoc(patentDocRef);
            await loading.dismiss();
            slidingItem.close();
          },
        },
      ],
    });
    // now present the alert on top of all other content
    await alert.present();
  }


  async presentFilter() {
    const modal = await this.modalCtrl.create({
      component: FilterPage,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { excludedTracks: this.excludeTracks },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.excludeTracks = data;
    }
  }

  closeSlidingItem(slidingItem: HTMLIonItemSlidingElement) {
    slidingItem.close();
  }

  async addFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any) {
    if (this.user.hasFavorite(sessionData.name)) {
      // Prompt to remove favorite
      this.removeFavorite(slidingItem, sessionData, "Favorite already added");
    } else {
      // Add as a favorite
      this.user.addFavorite(sessionData.name);

      // Close the open item
      slidingItem.close();

      // Create a toast
      const toast = await this.toastCtrl.create({
        header: `${sessionData.name} was successfully added as a favorite.`,
        duration: 3000,
        buttons: [
          {
            text: "Close",
            role: "cancel",
          },
        ],
      });

      // Present the toast at the bottom of the page
      await toast.present();
    }
  }

  async removeFavorite(
    slidingItem: HTMLIonItemSlidingElement,
    sessionData: any,
    title: string
  ) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: "Would you like to remove this session from your favorites?",
      buttons: [
        {
          text: "Cancel",
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          },
        },
        {
          text: "Remove",
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(sessionData.name);
            // close the sliding item and hide the option buttons
            slidingItem.close();
          },
        },
      ],
    });
    // now present the alert on top of all other content
    await alert.present();
  }

}
