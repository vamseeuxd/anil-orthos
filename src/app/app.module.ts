import { HttpClientModule } from "@angular/common/http";
import { NgModule, isDevMode } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { IonicModule } from "@ionic/angular";
import { IonicStorageModule } from "@ionic/storage-angular";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FormsModule } from "@angular/forms";
import { ServiceWorkerModule } from "@angular/service-worker";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideFirebaseApp, getApp, initializeApp } from "@angular/fire/app";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVjcFjelhmOcMlkYb4lopDfh0cQNgqv3M",
  authDomain: "anilorthos.firebaseapp.com",
  projectId: "anilorthos",
  storageBucket: "anilorthos.appspot.com",
  messagingSenderId: "535123968458",
  appId: "1:535123968458:web:843f01bf315b3e6bbf8f33",
  measurementId: "G-4KTCZL46FM",
};

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: "registerWhenStable:30000",
    }),
    provideFirebaseApp(() => initializeApp({ ...firebaseConfig })),
    provideFirestore(() => getFirestore()),
  ],
  declarations: [AppComponent],
  providers: [InAppBrowser, provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
