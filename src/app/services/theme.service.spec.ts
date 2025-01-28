import {TestBed} from '@angular/core/testing';
import {ThemeService} from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with the correct dark mode state', () => {
    const isSystemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    expect(service.isDarkMode).toBe(isSystemDarkMode);
  });

  it('should update isDarkMode when media query event fires', () => {
    const mockMediaQueryList = {
      matches: false,
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener'),
      dispatchEvent: jasmine.createSpy('dispatchEvent'),
    };

    spyOn(window, 'matchMedia').and.returnValue(mockMediaQueryList as any);
    service = TestBed.inject(ThemeService);

    expect(service.isDarkMode).toBeFalse();
    
    const mockEvent = new Event('change') as MediaQueryListEvent;
    Object.defineProperty(mockEvent, 'matches', {value: true, writable: false});

    service['mediaQueryList'].dispatchEvent(mockEvent);

    expect(service.isDarkMode).toBeTrue();
  });

  it('should allow manual override of isDarkMode using the setter', () => {
    service.isDarkMode = true;
    expect(service.isDarkMode).toBeTrue();

    service.isDarkMode = false;
    expect(service.isDarkMode).toBeFalse();
  });
});
