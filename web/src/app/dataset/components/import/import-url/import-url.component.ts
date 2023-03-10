import { Component, EventEmitter, Output } from '@angular/core';
import { ImportService } from '../../../import.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dataset-import-url',
  templateUrl: './import-url.component.html',
  styleUrls: ['./import-url.component.scss']
})
export class ImportUrlComponent {
  private url;

  @Output()
  private close = new EventEmitter();

  constructor(private router: Router, private importService: ImportService) {
  }

  importUrl() {
    if (this.url) {
      this.importService.importUrl(this.url)
        .then((dataset) => {
          this.router.navigate(['/dataset/detail', dataset.datasetId]);
        });
    }
  }
}
