import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-input-bar',
  templateUrl: './input-bar.component.html',
  styleUrls: ['./input-bar.component.scss']
})
export class InputBarComponent {

  @Input() rightIcon: string = null;
  @Input() leftIcon: string = null;
  @Input() placeholder: string;

  value: string;

  @Input()
  get inputValue() {
    return this.value;
  }

  @Output() inputValueChange = new EventEmitter();

  // tslint:disable-next-line:adjacent-overload-signatures
  set inputValue(value) {
    this.value = value;
    this.inputValueChange.emit(this.value);
  }

}
