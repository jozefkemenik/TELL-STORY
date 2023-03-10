import { Injectable } from '@angular/core';
import { HttpService } from '../shared/providers/http.service';
import { DatasetDetail } from './models/dataset';

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  constructor(private http: HttpService) {
  }

  importUrl(url: string): Promise<DatasetDetail> {
    return this.http.post('/csvImport/importCsv', {fileUrl: url}).then(datasetDetail => {
      return datasetDetail as DatasetDetail;
    });
  }
}
