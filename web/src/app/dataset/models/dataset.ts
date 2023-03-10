export class Dataset {
  datasetId: number;
  datasetName?: any;
  datasetUID: string;
  rowsCount: number;
  columnsCount: number;
  createdDate: Date;
}

export class DatasetColumn {
  id: number;
  columnName: string;
  columnType: string;
}

export class DatasetDetail {
  datasetId?: number;
  datasetName?: any;
  datasetUID: string;
  rowsCount: number;
  columnsCount: number;
  createdDate: Date;
  datasetColumns: Array<DatasetColumn>;
}

export class DatasetListResponse {
  datasets: Array<Dataset> = [];
  totalRecords = 0;
}
