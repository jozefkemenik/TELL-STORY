import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-switch-bar',
  templateUrl: './switch-bar.component.html',
  styleUrls: ['./switch-bar.component.scss']
})
export class SwitchBarComponent {
  @Input() rightSide: object;
  @Input() leftSide: object;
  @Input() enabled = true;

  stateValue: boolean;

  @Input()
  get state() {
    return this.stateValue;
  }

  @Output() stateChange = new EventEmitter();

  // tslint:disable-next-line:adjacent-overload-signatures
  set state(state) {
    this.stateValue = state;
    this.stateChange.emit(this.stateValue);
  }
}
