import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {Button} from "primeng/button";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {SidebarState} from "./app.types";
import {BreakpointObserver} from '@angular/cdk/layout';
import {NgIf} from "@angular/common";
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {MugComponent} from "./components/mug/mug.component";

@Component({
  imports: [
    Button,
    NgIf,
    SidebarComponent,
    MugComponent
  ],
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.component.scss',
  animations: [
    trigger('slideIn', [
      state(SidebarState.Open, style({
        transform: 'translateX(0px)',
      })),
      state(SidebarState.Closed, style({
        transform: 'translateX(-100%)'
      })),
      transition('open => closed', animate('300ms ease-in')),
      transition('closed => open', animate('300ms ease-out'))
    ]),
    trigger('fadeInOut', [
      state('void', style({opacity: 0})),
      transition('void => *', [
        animate('300ms ease-in-out')
      ]),
      transition('* => void', [
        animate('300ms ease-in-out')
      ])
    ])
  ],
  template: `
    <div class="h-screen flex bg-surface-50">
      <p-button (click)="toggleSidebar()" *ngIf="isSmallScreen" [@fadeInOut]="'*'" [raised]="true"
                [rounded]="true"
                class="absolute top-2 right-2 z-20" icon="pi pi-bars" size="large"/>
      <app-sidebar
        [@slideIn]="sidebarState"
        class="shrink-0 absolute lg:static h-screen bg-surface-0 rounded-r-xl lg:rounded-r-none shadow-md lg:shadow-none select-none z-10 p-4"
        style="width: 280px"/>
      <app-mug [isMugMoving]="true" class="grow"/>
    </div>
  `
})
export class AppComponent implements OnInit {
  @ViewChild(SidebarComponent) sidebarComponent!: SidebarComponent;

  title = 'mug-maker';

  protected isSmallScreen = false;
  protected sidebarState = SidebarState.Closed;

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

