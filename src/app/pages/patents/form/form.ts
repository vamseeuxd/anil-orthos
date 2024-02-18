import { Component, ViewChild, inject } from "@angular/core";

import { FormsModule, NgForm, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { IonicModule, LoadingController, NavController } from "@ionic/angular";
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  DocumentReference,
  doc,
  updateDoc,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { getDoc } from "@firebase/firestore";
import { IPatent } from "../IPatent";

@Component({
  selector: "patent-form",
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  styleUrls: ["./form.scss"],
  templateUrl: "form.html",
})
export class FormPage {
  @ViewChild("form") form: NgForm;
  defaultHref = "/app/tabs/patents";
  firestore: Firestore = inject(Firestore);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  navController: NavController = inject(NavController);
  loadingCtrl: LoadingController = inject(LoadingController);
  patentsCollection = collection(this.firestore, "patents");
  patentDocRef: DocumentReference;
  patentInfo: any;
  patentId = "";
  patents$: Observable<IPatent[]> = collectionData(this.patentsCollection, {
    idField: "id",
  }) as Observable<IPatent[]>;

  constructor() {
    const sub = this.route.params.subscribe(async ({ patentId }) => {
      const loading = await this.showLoading();
      console.log(patentId);
      this.patentId = patentId;
      sub.unsubscribe();
      this.patentDocRef = doc(
        this.firestore,
        `${this.patentsCollection.path}/${this.patentId}`
      );
      this.patentInfo = (await getDoc(this.patentDocRef)).data();
      this.form.resetForm(this.patentInfo);
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

  async addPatent(form: NgForm) {
    const loading = await this.showLoading();
    if (this.patentId && this.patentId.length > 0) {
      await updateDoc(this.patentDocRef, form.value);
    } else {
      await addDoc(this.patentsCollection, form.value);
    }
    form.resetForm({});
    await loading.dismiss();
    this.goBack();
  }

  goBack() {
    this.navController.back();
  }
}
