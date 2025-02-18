import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {Button} from "primeng/button";
import {ColorChangeEvent, SidebarState} from "./app.types";
import {BreakpointObserver} from '@angular/cdk/layout';
import {NgIf} from "@angular/common";
import {SidebarComponent} from "./features/sidebar/sidebar.component";
import {MugComponent} from "./features/mug/mug.component";
import {fadeInOutAnimation, iconAnimation, slideInAnimation} from "./app.animations";
import {LayoutComponent} from "./layout/layout.component";

@Component({
  imports: [
    Button,
    NgIf,
    SidebarComponent,
    MugComponent,
    LayoutComponent
  ],
  selector: 'app-root',
  standalone: true,
  animations: [fadeInOutAnimation, slideInAnimation, iconAnimation],
  template: `
    <app-layout>

      <p-button (click)="toggleSidebar()" *ngIf="isSmallScreen" [@icon]="sidebarState" [@fadeInOut]="'*'"
                [raised]="true" [rounded]="true"
                class="absolute top-2 right-2 z-20"
                icon="pi pi-plus" sidebar size="large"/>

      <app-sidebar [@slideIn]="sidebarState"
                   class="shrink-0 absolute lg:static h-full
                        bg-surface-0 dark:bg-surface-900 rounded-r-xl lg:rounded-r-none
                        shadow-md lg:shadow-none select-none z-10 p-4 overflow-y-auto"
                   sidebar
                   style="width: 280px"
                   (mugRotationChange)="isMugRotating = $event" (colorChanged)="onColorChanged($event)"
                   (fileUploaded)="onFileUploaded($event)"/>

      <app-mug [isMugRotating]="isMugRotating" class="grow" main/>

    </app-layout>
  `
})
export class AppComponent implements OnInit {
  title = 'mug-maker';

  @ViewChild(MugComponent) mugComponent!: MugComponent;

  protected isSmallScreen = false;
  protected sidebarState = SidebarState.Closed;
  protected isMugRotating = true;

  private readonly breakpointObserver = inject(BreakpointObserver);

  ngOnInit(): void {
    this.breakpointObserver.observe(['(max-width: 1024px)']).subscribe(({matches}) => {
      this.isSmallScreen = matches;
      if (!matches) {
        this.sidebarState = SidebarState.Open;
      }
    });
  }

  protected toggleSidebar(): void {
    this.sidebarState = this.sidebarState === SidebarState.Closed ? SidebarState.Open : SidebarState.Closed;
  }

  onColorChanged(color: ColorChangeEvent): void {
    this.mugComponent.updateMugColor(color);
  }

  onFileUploaded(file: File): void {
    this.mugComponent.updateMugLogo(file);
  }

}

