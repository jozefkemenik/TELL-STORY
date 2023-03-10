export class Dataset {
  datasetId: string;
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

export class  DatasetDetail {
  datasetName?: any;
  datasetUID: string;
  rowsCount: number;
  columnsCount: number;
  createdDate: Date;
  datasetColumns: Array<DatasetColumn>;
}
