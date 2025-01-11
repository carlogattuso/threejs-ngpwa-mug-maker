import {Component} from '@angular/core';
import {SpeedDial} from "primeng/speeddial";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    SpeedDial
  ],
  styleUrl: './toolbar.component.scss',
  template: `
    <p-speeddial [model]="items" direction="down"
                 class="absolute top-2 left-2"
                 [buttonProps]="{ severity: 'contrast'}"
                 [tooltipOptions]="{ tooltipPosition: 'right' }">
    </p-speeddial>
  `
})
export class ToolbarComponent {
  items: MenuItem[] = [
    {
      label: 'Upload design',
      icon: 'pi pi-upload',
    },
    {
      label: 'Download template',
      icon: 'pi pi-download',
    },
    {
      label: 'Stop movement',
      icon: 'pi pi-stop',
    },
    {
      label: 'Customize color',
      icon: 'pi pi-palette',
    }
  ];

}
