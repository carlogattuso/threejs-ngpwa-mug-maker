import {ApplicationConfig, isDevMode, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideServiceWorker} from '@angular/service-worker';
import {provideHttpClient, withFetch} from "@angular/common/http";
import {providePrimeNG} from "primeng/config";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {MyPreset} from "../../preset";

export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({
      ripple: true,
      theme: {
        preset: MyPreset,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities'
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
