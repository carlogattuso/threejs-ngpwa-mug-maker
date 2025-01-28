import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
  private readonly _isDarkMode = signal(this.mediaQueryList.matches);

  get isDarkMode(): boolean {
    return this._isDarkMode();
  }

  set isDarkMode(value: boolean) {
    this._isDarkMode.set(value);
  }

  constructor() {
    this.mediaQueryList.addEventListener('change', (event: MediaQueryListEvent): void => {
      this.isDarkMode = event.matches;
    });
  }
}
