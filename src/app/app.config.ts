import {ApplicationConfig, isDevMode, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideServiceWorker} from '@angular/service-worker';
import {provideHttpClient, withFetch} from "@angular/common/http";
import {providePrimeNG} from "primeng/config";

import Aura from '@primeng/themes/aura';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";

export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, tailwind-utilities, primeng'
          }
        }
      }
    }),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideHttpClient(withFetch())
  ]
};
