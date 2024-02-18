import { Component, ViewChild, inject } from "@angular/core";

import { ActivatedRoute, Router } from "@angular/router";
import {
  Firestore,
  DocumentReference,
  collection,
  collectionData,
  doc,
  getDoc,
} from "@angular/fire/firestore";
import { NgForm } from "@angular/forms";
import { NavController, LoadingController } from "@ionic/angular";
import { Observable } from "rxjs";
import { IPatent } from "../IPatent";

@Component({
  selector: "patent-detail",
  styleUrls: ["./detail.scss"],
  templateUrl: "detail.html",
})
export class DetailPage {
  defaultHref = "/app/tabs/patents";
  firestore: Firestore = inject(Firestore);
  loadingCtrl: LoadingController = inject(LoadingController);
  patentDocRef: DocumentReference;
  patent: IPatent;
  patentId = "";
  route: ActivatedRoute = inject(ActivatedRoute);
  patentsCollection = collection(this.firestore, "patents");
  constructor() {
    const sub = this.route.params.subscribe(async ({ patentId }) => {
      const loading = await this.showLoading();
      this.patentId = patentId;
      sub.unsubscribe();
      this.patentDocRef = doc(
        this.firestore,
        `${this.patentsCollection.path}/${this.patentId}`
      );
      this.patent = (await getDoc(this.patentDocRef)).data() as IPatent;
      await loading.dismiss();
    });
  }
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: "Please wait...",
      duration: null,
    });
    loading.present();
    return loading;
  }
}
