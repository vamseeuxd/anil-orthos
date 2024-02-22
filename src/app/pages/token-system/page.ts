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
import { getDoc } from "@firebase/firestore";
import { Observable, forkJoin, from, of, switchMap } from "rxjs";
import { IToken, ITokenWithPatent } from "./IToken";
import speech from 'speech-synth';

@Component({
  selector: "page-tokens",
  templateUrl: "page.html",
  styleUrls: ["./page.scss"],
})
export class Page implements OnInit {
  // Gets a reference to the list element
  @ViewChild("scheduleList", { static: true }) scheduleList: IonList;

  firestore: Firestore = inject(Firestore);
  tokensCollection = collection(this.firestore, "tokens");
  tokens$: Observable<IToken[]> = collectionData(this.tokensCollection, {
    idField: "id",
  }) as Observable<IToken[]>;

  tokensWithPatentInfo$: Observable<ITokenWithPatent[]> = this.tokens$.pipe(
    switchMap((tokens) => {
      const allPatents = tokens.map((token) => {
        const docRef = doc(this.firestore, `patents`, token.patentId);
        const observable = from(getDoc(docRef)).pipe(
          switchMap((ddd) => {
            return of({
              patent: { ...ddd.data(), id: token.patentId },
              ...token,
            } as ITokenWithPatent);
          })
        );
        return observable;
      });
      return forkJoin(allPatents);
    })
  );

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

  async speakText(text: string) {
    console.log(text);
    /* const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance); */
    speech.say(text)
  }

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

  async deleteToken(tokenId: string) {
    const alert = await this.alertCtrl.create({
      header: "Delete Confirmatiom",
      message: "Would you like to delete this Token?",
      buttons: [
        {
          text: "Cancel",
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            //slidingItem.close();
          },
        },
        {
          text: "Delete",
          handler: async () => {
            const loading = await this.showLoading();
            const tokenDocRef = doc(
              this.firestore,
              `${this.tokensCollection.path}/${tokenId}`
            );
            await deleteDoc(tokenDocRef);
            await loading.dismiss();
            // slidingItem.close();
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
