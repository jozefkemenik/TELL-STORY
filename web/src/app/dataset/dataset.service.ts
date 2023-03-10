import { Injectable } from '@angular/core';
import { HttpService } from '../shared/providers/http.service';
import { DatasetDetail, DatasetListResponse } from './models/dataset';

@Injectable({
  providedIn: 'root'
})

export class DatasetService {

  constructor(private http: HttpService) {
  }

  getDatasetDetail(datasetId: string): Promise<DatasetDetail> {
    return this.http.get('/widget/getDataset', {Id: datasetId}).then(datasetDetail => {
      return datasetDetail as DatasetDetail;
    });
  }

  getDatasets(pageLength: number, page: number): Promise<DatasetListResponse> {
    return this.http.get('/widget/getuserdatasets', {limit: pageLength, offset: (page - 1) * pageLength}).then(datasets => {
      return datasets as DatasetListResponse;
    });
  }
}



