import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEsCl from '@angular/common/locales/es-CL';
import { LOCALE_ID } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';

registerLocaleData(localeEsCl, 'es-CL');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD77f7BEa0t7-42yUqkbV8yxPccB_hCkzI",
  authDomain: "app-reposteria-d4bdd.firebaseapp.com",
  databaseURL: "https://app-reposteria-d4bdd-default-rtdb.firebaseio.com",
  projectId: "app-reposteria-d4bdd",
  storageBucket: "app-reposteria-d4bdd.appspot.com",
  messagingSenderId: "201350245410",
  appId: "1:201350245410:web:14d9e633640f6da9f66e7b",
  measurementId: "G-KLDBZCNYKL"
};

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(
      MatSnackBarModule,
      BrowserAnimationsModule,
      MatIconModule,
      CommonModule,
      MatDialogModule,
      HttpClientModule
    ),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideDatabase(() => getDatabase()),
    { provide: LOCALE_ID, useValue: 'es-CL' }
  ]
})
.catch((err) => console.error(err));
