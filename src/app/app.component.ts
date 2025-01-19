import {Component, inject, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {SidebarState} from "./app.types";
import {BreakpointObserver} from '@angular/cdk/layout';
import {NgIf} from "@angular/common";
import {SidebarComponent} from "./features/sidebar/sidebar.component";
import {MugComponent} from "./features/mug/mug.component";
import {fadeInOutAnimation, slideInAnimation} from "./app.animations";
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
  styleUrl: './app.component.scss',
  animations: [fadeInOutAnimation, slideInAnimation],
  template: `
    <app-layout>

      <p-button (click)="toggleSidebar()" *ngIf="isSmallScreen" [@fadeInOut]="'*'" [raised]="true" [rounded]="true"
                class="absolute top-2 right-2 z-20"
                icon="pi pi-bars" sidebar size="large"/>

      <app-sidebar [@slideIn]="sidebarState"
                   class="shrink-0 absolute lg:static h-screen bg-surface-0 rounded-r-xl lg:rounded-r-none shadow-md lg:shadow-none select-none z-10 p-4"
                   sidebar
                   style="width: 280px"
                   (mugRotationChange)="isMugRotating = $event"/>

      <app-mug [isMugRotating]="isMugRotating" class="grow" main/>

    </app-layout>
  `
})
export class AppComponent implements OnInit {
  title = 'mug-maker';

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

}

