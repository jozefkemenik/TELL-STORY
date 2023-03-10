import { Injectable } from '@angular/core';
import { HttpService } from '../shared/providers/http.service';
import { QueryResult } from './models/query';

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  constructor(private http: HttpService) {
  }

  executeQuery(query: string): Promise<QueryResult> {
    return this.http.post('/sqlquery/executequery', {query}).then((data) => {
      const queryResult = new QueryResult();
      queryResult.data = data;
      return queryResult;
    });
  }

  getDatasetTableData(
    datasetUUID: string,
    pageLength: number,
    page: number,
    orderColumn: string,
    orderDirection: string
  ): Promise<QueryResult> {
    // noinspection SqlNoDataSourceInspection
    return this.executeQuery(
      'SELECT * FROM [' + datasetUUID + ']'
      + (
        orderColumn
          ? (' ORDER BY [' + datasetUUID + '].' + orderColumn)
            + (orderDirection ? (' ' + orderDirection) : '')
          : ''
      )
      + ' LIMIT ' + pageLength + ' OFFSET ' + ((page - 1) * pageLength) + ';'
    );
  }
}
