import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  Renderer2,
  signal
} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Button} from "primeng/button";
import {ColorPickerFormComponent} from "../color-picker-form/color-picker-form.component";
import {Divider} from "primeng/divider";
import {Message} from "primeng/message";
import {isPlatformBrowser, Location, NgForOf, NgIf} from "@angular/common";
import {SelectButton} from "primeng/selectbutton";
import {DefaultLogoFilename, DefaultLogoPath, SmallScreenBreakpointInPixels} from "../../app.constants";
import {ColorChangeEvent, RotationState, SidebarState} from "../../app.types";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    Button,
    ColorPickerFormComponent,
    Divider,
    Message,
    NgForOf,
    NgIf,
    SelectButton,
    FormsModule
  ],
  styleUrl: './sidebar.component.scss',
  animations: [
    trigger('sidebarAnimation', [
      state('opened', style({
        transform: 'translateX(0px)'
      })),
      state('closed', style({
        transform: 'translateX(-100%)'
      })),
      transition('opened => closed', animate('300ms ease-in')),
      transition('closed => opened', animate('300ms ease-out'))
    ])
  ],
  template: `
    <div
      class="h-screen bg-surface-0 absolute lg:static select-none z-10 shadow p-4"
      [@sidebarAnimation]="sidebarState"
      style="max-width: 280px;">

      <p-button
        *ngIf="isToggleSidebarButtonVisible"
        class="floating"
        size="large"
        severity="secondary"
        [raised]="true"
        [icon]="'pi '.concat(getSidebarButtonIcon())"
        (click)="toggleSidebar()">
      </p-button>

      <p-divider align="left" type="solid">
        <span class="font-medium">Design</span>
      </p-divider>

      <div class="flex flex-col gap-2">
        <p-button [label]="_uploadedLogoName ?  _uploadedLogoName : 'Upload your design'" icon="pi pi-upload"
                  (click)="fileInput.click()" styleClass="w-full"/>
        <ng-container *ngFor="let text of errorMessages();">
          <p-message
            severity="error"
            variant="simple"
            styleClass="flex flex-col items-center"
            [text]="text"/>
        </ng-container>
        <input type="file" #fileInput accept="image/png" style="display: none"
               (change)="onLogoUploaded($event)"/>
        <p-button label="Download template" severity="secondary" icon="pi pi-download"
                  (click)="downloadTemplate()" styleClass="w-full"/>
      </div>

      <p-divider align="left" type="solid">
        <span class="font-medium">Rotation</span>
      </p-divider>

      <p-selectButton
        [options]="mugRotationStates"
        [(ngModel)]="isMugMoving"
        optionLabel="label"
        optionValue="value"
        [allowEmpty]="false"/>

      <p-divider align="left" type="solid">
        <span class="font-medium">Color</span>
      </p-divider>

      <app-color-picker-form (colorChange)="onColorChange($event)"/>

    </div>
  `
})
export class SidebarComponent implements OnInit {
  private readonly platformId: object = inject(PLATFORM_ID);
  private readonly renderer2: Renderer2 = inject(Renderer2);

  protected sidebarState: SidebarState = SidebarState.Closed;
  protected isToggleSidebarButtonVisible = false;
  protected mugRotationStates: RotationState[] = [{label: 'On', value: true}, {label: 'Off', value: false}];
  protected errorMessages = signal<string[]>([]);
  protected _uploadedLogoName: string | undefined;

  @Input() isMugMoving = true;
  @Output() colorChanged = new EventEmitter<ColorChangeEvent>();
  @Output() logoUploaded = new EventEmitter<Event>();

  set uploadedLogoName(value: string | undefined) {
    this._uploadedLogoName = value;
  }


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateSidebarState();
    }
  }

  private updateSidebarState() {
    this.isToggleSidebarButtonVisible = this.isSmallScreen();
    this.sidebarState = this.isSmallScreen() ? SidebarState.Closed : SidebarState.Opened;
  }

  toggleSidebar(): void {
    this.sidebarState = this.sidebarState === SidebarState.Opened ? SidebarState.Closed : SidebarState.Opened;
  }

  isSmallScreen(): boolean {
    return window.innerWidth < SmallScreenBreakpointInPixels;
  }

  @HostListener('window:resize')
  onResize() {
    this.updateSidebarState();
  }

  pushErrorMessages(messages: string[]) {
    this.errorMessages.set(messages);
  }

  clearErrorMessages() {
    this.errorMessages.set([]);
  }

  downloadTemplate(): void {
    const anchorElement: HTMLAnchorElement = this.renderer2.createElement('a');
    this.renderer2.setAttribute(anchorElement, 'href', Location.joinWithSlash(DefaultLogoPath, DefaultLogoFilename));
    this.renderer2.setAttribute(anchorElement, 'download', DefaultLogoFilename);
    anchorElement.click();
  }

  onLogoUploaded(event: Event) {
    this.logoUploaded.emit(event);
  }

  onColorChange(color: ColorChangeEvent) {
    this.colorChanged.emit(color);
  }

  getSidebarButtonIcon(): string {
    return this.sidebarState === SidebarState.Opened ? 'pi-times' : 'pi-sliders-h';
  }
}
