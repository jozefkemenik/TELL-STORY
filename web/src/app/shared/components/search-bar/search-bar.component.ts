import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {

  value: string;

  @Input()
  get searchValue() {
    return this.value;
  }

  @Output() searchValueChange = new EventEmitter();

  // tslint:disable-next-line:adjacent-overload-signatures
  set searchValue(value) {
    this.value = value;
    this.searchValueChange.emit(this.value);
  }

}
