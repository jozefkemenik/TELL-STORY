import {Injectable} from '@angular/core';
import {HttpService} from '../../shared/providers/http.service';
import {DatasetDetail} from '../models/dataset';

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

  getDatasets(): Promise<Array<DatasetDetail>> {
    return this.http.get('/widget/getuserdatasets', null).then(datasets => {
      return Promise.all(datasets.datasets.map(async (dataset) => {
        return await this.getDatasetDetail(dataset.datasetId);
      })).then((result) => {
        return result as unknown as Array<DatasetDetail>;
      });
    });
  }
}



