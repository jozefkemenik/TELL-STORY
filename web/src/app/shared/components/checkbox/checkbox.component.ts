import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent {
  stateValue = false;

  @Input()
  get state() {
    return this.stateValue;
  }

  @Output() stateChange = new EventEmitter<boolean>();

  // tslint:disable-next-line:adjacent-overload-signatures
  set state(state) {
    this.stateValue = state;
    this.stateChange.emit(this.stateValue);
  }
}
