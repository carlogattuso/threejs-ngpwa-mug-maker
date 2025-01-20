import {Component} from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  template: `
    <div class="h-screen flex bg-surface-50">
      <ng-content select="[sidebar]"></ng-content>
      <ng-content select="[main]"></ng-content>
    </div>
  `
})
export class LayoutComponent {
}
