import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-btnsocial',
  imports: [],
  templateUrl: './btnsocial.component.html',
  styleUrl: './btnsocial.component.css'
})
export class BtnsocialComponent {
  @Input() svgicon: string = "";
}
