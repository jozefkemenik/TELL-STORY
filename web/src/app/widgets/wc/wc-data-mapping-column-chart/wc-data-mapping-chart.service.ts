import { Injectable } from '@angular/core';
import { HttpService } from '../../../shared/providers/http.service'
import { Dataset, DatasetDetail } from './models/model'



@Injectable({
  providedIn: 'root'
})
export class WcDataMappingColumnChartService {

  constructor(private http: HttpService) { }

  getDatasetDetail(ds: Dataset): Promise<DatasetDetail> {
    return this.http.get('/widget/getDataset', { "Id": ds.datasetId }).then(r => {
      return r as DatasetDetail;
    })
  }

  getDatasets(): Promise<Array<Dataset>> {
    return this.http.get('/widget/getuserdatasets', null).then(r => {
      return r as Array<Dataset>
    });
  }
}



