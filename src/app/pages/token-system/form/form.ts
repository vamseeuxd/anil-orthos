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
import { IToken } from "../IToken";
import { SearchbarDirective } from "../../../components/searchbar/searchbar.directive";

@Component({
  selector: "token-form",
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    SearchbarDirective,
  ],
  styleUrls: ["./form.scss"],
  templateUrl: "form.html",
})
export class FormPage {
  @ViewChild("form") form: NgForm;
  defaultHref = "/app/tabs/tokens";
  firestore: Firestore = inject(Firestore);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  navController: NavController = inject(NavController);
  loadingCtrl: LoadingController = inject(LoadingController);
  tokensCollection = collection(this.firestore, "tokens");
  tokenDocRef: DocumentReference;
  tokenInfo: any;
  tokenId = "";
  tokens$: Observable<IToken[]> = collectionData(this.tokensCollection, {
    idField: "id",
  }) as Observable<IToken[]>;

  masterPatents = [
    { id: "1", label: "Vamsee" },
    { id: "2", label: "Kalyan" },
    { id: "3", label: "Sunkara" },
    { id: "4", label: "Krishna" },
  ];

  patents = this.masterPatents;

  constructor() {
    const sub = this.route.params.subscribe(async ({ tokenId }) => {
      const loading = await this.showLoading();
      this.tokenId = tokenId;
      sub.unsubscribe();
      this.tokenDocRef = doc(
        this.firestore,
        `${this.tokensCollection.path}/${this.tokenId}`
      );
      this.tokenInfo = (await getDoc(this.tokenDocRef)).data();
      this.form.resetForm(this.tokenInfo);
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

  async addToken(form: NgForm) {
    const loading = await this.showLoading();
    if (this.tokenId && this.tokenId.length > 0) {
      await updateDoc(this.tokenDocRef, form.value);
    } else {
      await addDoc(this.tokensCollection, form.value);
    }
    form.resetForm({});
    await loading.dismiss();
    this.goBack();
  }

  goBack() {
    this.navController.back();
  }

  setValue(key, value, form: NgForm) {
    form.setValue({ ...form.value, [key]: value });
  }

  filterPatentList($event: Event) {
    const value: string = ($event.target as HTMLInputElement).value;
    this.patents = this.masterPatents.filter((p) =>
      p.label.toLowerCase().includes(value.trim().toLowerCase())
    );
  }
}
