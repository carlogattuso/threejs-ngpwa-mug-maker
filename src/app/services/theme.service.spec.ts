import {TestBed} from '@angular/core/testing';
import {ThemeService} from './theme.service';

describe('ThemeService', () => {
  let themeService: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    themeService = TestBed.inject(ThemeService);
  });

  describe('Service Initialization', () => {
    it('should create service instance', () => {
      expect(themeService).toBeTruthy();
    });

    it('should initialize dark mode based on system preference', () => {
      const systemDarkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;

      expect(themeService.isDarkMode).toBe(systemDarkModePreference);
    });
  });

  describe('System Theme Changes', () => {
    it('should update theme when system preference changes', () => {
      const mockMediaQueryList = {
        matches: false,
        addEventListener: jasmine.createSpy('addEventListener'),
        removeEventListener: jasmine.createSpy('removeEventListener'),
        dispatchEvent: jasmine.createSpy('dispatchEvent'),
      };

      spyOn(window, 'matchMedia').and.returnValue(mockMediaQueryList as any);
      themeService = TestBed.inject(ThemeService);

      expect(themeService.isDarkMode).toBeFalse();

      const systemThemeChangeEvent = new Event('change') as MediaQueryListEvent;
      Object.defineProperty(systemThemeChangeEvent, 'matches', {
        value: true,
        writable: false
      });

      themeService['mediaQueryList'].dispatchEvent(systemThemeChangeEvent);

      expect(themeService.isDarkMode).toBeTrue();
    });
  });

  describe('Manual Theme Control', () => {
    it('should allow manual theme switching', () => {
      themeService.isDarkMode = true;
      expect(themeService.isDarkMode).toBeTrue();

      themeService.isDarkMode = false;
      expect(themeService.isDarkMode).toBeFalse();
    });
  });
});
