import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dataset-import-file',
  templateUrl: './import-file.component.html',
  styleUrls: ['./import-file.component.scss']
})
export class ImportFileComponent {
  @Output()
  private close = new EventEmitter();
}
