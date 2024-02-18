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
import { Firestore, collection, collectionData } from "@angular/fire/firestore";
import { Observable, map, of, switchMap } from "rxjs";
import { ISchedule } from "./ISchedule";
import { IGroupedSchedule } from "./IGroupedSchedule";

@Component({
  selector: "page-schedule",
  templateUrl: "page.html",
  styleUrls: ["./page.scss"],
})
export class Page implements OnInit {
  // Gets a reference to the list element
  @ViewChild("scheduleList", { static: true }) scheduleList: IonList;

  ios: boolean;
  dayIndex = 0;
  queryText = "";
  segment = "all";
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  confDate: string;
  showSearchbar: boolean;

  firestore: Firestore = inject(Firestore);
  schedulesCollection = collection(this.firestore, "schedules");
  schedules$: Observable<ISchedule[]> = collectionData(
    this.schedulesCollection,
    {
      idField: "id",
    }
  ) as Observable<ISchedule[]>;

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
  ) {
    console.log("-------------groupedSchedules--------------");
    this.groupedSchedules$.subscribe((groupedSchedules) => {
      console.log(groupedSchedules);
    });
  }

  groupedSchedules$: Observable<IGroupedSchedule[]> = this.schedules$.pipe(
    switchMap((schedules) => {
      const groupedEvents: IGroupedSchedule[] = [];
      schedules.forEach((schedule) => {
        const existingGroup: IGroupedSchedule = groupedEvents.find(
          (group) => group.time === schedule.time
        );
        if (existingGroup) {
          existingGroup.sessions.push(schedule);
        } else {
          groupedEvents.push({ time: schedule.time, sessions: [schedule] });
        }
      });
      return of(groupedEvents);
    })
    /* map((schedules) =>
      schedules.reduce(
        (acc, event) => {
          const time = event.time;
          acc.groups["time"] = time;
          // acc.groups[time] = acc.groups[time] || { sessions: [] };
          acc.groups["sessions"] = acc.groups["sessions"] || [];
          acc.groups["sessions"].push(event);
          return acc;
        },
        { groups: {} } as IGroupedSchedule
      )
    ) */
  );

  ngOnInit() {
    this.updateSchedule();

    this.ios = this.config.get("mode") === "ios";
  }

  updateSchedule() {
    // Close any open sliding items when the schedule updates
    if (this.scheduleList) {
      this.scheduleList.closeSlidingItems();
    }

    this.confData
      .getTimeline(
        this.dayIndex,
        this.queryText,
        this.excludeTracks,
        this.segment
      )
      .subscribe((data: any) => {
        this.shownSessions = data.shownSessions;
        this.groups = data.groups;
      });
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
      this.updateSchedule();
    }
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
            this.updateSchedule();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          },
        },
      ],
    });
    // now present the alert on top of all other content
    await alert.present();
  }

  async openSocial(network: string, fab: HTMLIonFabElement) {
    const loading = await this.loadingCtrl.create({
      message: `Posting to ${network}`,
      duration: Math.random() * 1000 + 500,
    });
    await loading.present();
    await loading.onWillDismiss();
    fab.close();
  }
}
