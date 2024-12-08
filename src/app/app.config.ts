import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { routes } from './app.routes'; // Asegúrate de que las rutas estén importadas

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

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideDatabase(() => getDatabase())
  ]
};
