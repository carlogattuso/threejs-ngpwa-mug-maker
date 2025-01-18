import {animate, state, style, transition, trigger} from "@angular/animations";
import {SidebarState} from "./app.types";

export const fadeInOutAnimation = trigger('fadeInOut', [
  state('void', style({opacity: 0})),
  transition('void => *', [
    animate('300ms ease-in-out')
  ]),
  transition('* => void', [
    animate('300ms ease-in-out')
  ])
]);

export const slideInAnimation = trigger('slideIn', [
  state(SidebarState.Open, style({
    transform: 'translateX(0px)',
  })),
  state(SidebarState.Closed, style({
    transform: 'translateX(-100%)'
  })),
  transition('open => closed', animate('300ms ease-in')),
  transition('closed => open', animate('300ms ease-out'))
]);
