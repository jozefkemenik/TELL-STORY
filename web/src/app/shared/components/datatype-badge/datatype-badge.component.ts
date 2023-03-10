import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-datatype-badge',
  templateUrl: './datatype-badge.component.html',
  styleUrls: ['./datatype-badge.component.scss']
})
export class DatatypeBadgeComponent {
  @Input()
  datatype: string;
}
