import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
  private _isDarkMode = signal(this.mediaQueryList.matches);

  get isDarkMode(): boolean {
    return this._isDarkMode();
  }

  set isDarkMode(value: boolean) {
    this._isDarkMode.set(value);
  }

  constructor() {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event: MediaQueryListEvent): void => {
        console.log(event.matches);
        this.isDarkMode = event.matches;
      });
  }
}
