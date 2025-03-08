import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {AppComponent} from './app.component'; // Import your AppComponent
import {provideAnimations} from '@angular/platform-browser/animations';
import {ColorChangeEvent, SidebarState} from "./app.types";
import {BreakpointObserver} from "@angular/cdk/layout";
import {of} from "rxjs";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    const breakpointObserverSpy = jasmine.createSpyObj('BreakpointObserver', ['observe']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideAnimations(),
        {provide: BreakpointObserver, useValue: breakpointObserverSpy}
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  describe('Initial State', () => {
    it('should create the app', () => {
      expect(component).toBeTruthy();
    });

    it(`should have the 'mug-maker' title`, () => {
      expect(component.title).toEqual('mug-maker');
    });

    it(`should have isMugMoving to true`, () => {
      expect(component.isMugRotating).toBeTrue();
    });

  });

  describe('Sidebar State', () => {
    let breakpointObserver: jasmine.SpyObj<BreakpointObserver>;

    beforeEach(() => {
      breakpointObserver = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;
    });

    it('should set isSmallScreen to true and sidebarState to Closed when screen is small', () => {
      breakpointObserver.observe.and.returnValue(of({matches: true, breakpoints: {}}));

      fixture.detectChanges();

      compiled = fixture.nativeElement as HTMLElement;

      expect(component.isSmallScreen).toBeTrue();
      expect(component.sidebarState).toBe(SidebarState.Closed);
      expect(compiled.querySelector('p-button[icon="pi pi-plus"][sidebar]')).toBeTruthy();
    });

    it('should set isSmallScreen to false when screen is large', () => {
      breakpointObserver.observe.and.returnValue(of({matches: false, breakpoints: {}}));

      fixture.detectChanges();

      compiled = fixture.nativeElement as HTMLElement;

      expect(component.isSmallScreen).toBeFalse();
      expect(component.sidebarState).toBe(SidebarState.Open);
      expect(compiled.querySelector('p-button[icon="pi pi-plus"][sidebar]')).toBeNull();
    });

    it('should call toggleSidebar and open sidebar when button is clicked and sidebar closed', fakeAsync(() => {
      breakpointObserver.observe.and.returnValue(of({matches: true, breakpoints: {}}));
      fixture.detectChanges();
      compiled = fixture.nativeElement as HTMLElement;

      const toggleSidebarButton = compiled.querySelector('p-button[icon="pi pi-plus"][sidebar]') as HTMLButtonElement;
      expect(toggleSidebarButton).toBeTruthy();

      toggleSidebarButton.click();
      tick();
      fixture.detectChanges();

      expect(component.sidebarState).toBe(SidebarState.Open);
    }));

    it('should call toggleSidebar and close sidebar when button is clicked and sidebar open', fakeAsync(() => {
      breakpointObserver.observe.and.returnValue(of({matches: true, breakpoints: {}}));
      component.sidebarState = SidebarState.Open;
      fixture.detectChanges();
      compiled = fixture.nativeElement as HTMLElement;

      const toggleSidebarButton = compiled.querySelector('p-button[icon="pi pi-plus"][sidebar]') as HTMLButtonElement;
      expect(toggleSidebarButton).toBeTruthy();

      toggleSidebarButton.click();
      tick();
      fixture.detectChanges();

      expect(component.sidebarState).toBe(SidebarState.Closed);
    }));
  });

  describe('Color Change event', () => {
    it('should update mug color when onColorChanged is called', () => {
      const mockColorEvent: ColorChangeEvent = { key: 'key', color: '#FF5733' };
      component.mugComponent = jasmine.createSpyObj('MugComponent', ['updateMugColor']);

      component.onColorChanged(mockColorEvent);

      expect(component.mugComponent.updateMugColor).toHaveBeenCalledWith(mockColorEvent);
    });
  });

  describe('File Upload event', () => {
    it('should update mug logo when onFileUploaded is called', () => {
      const mockFile = new File(['dummy content'], 'logo.png', { type: 'image/png' });
      component.mugComponent = jasmine.createSpyObj('MugComponent', ['updateMugLogo']);

      component.onFileUploaded(mockFile);

      expect(component.mugComponent.updateMugLogo).toHaveBeenCalledWith(mockFile);
    });
  });
});
