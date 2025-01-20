import {Component} from '@angular/core';

@Component({
  selector: 'app-flex-chip-list',
  standalone: true,
  template: `
    <div class="flex flex-wrap gap-2 mb-4">
      <ng-content select="[chip-list]"></ng-content>
    </div>
  `
})
export class FlexChipListComponent {

}
