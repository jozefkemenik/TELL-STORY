import {HttpService} from '../../shared/providers/http.service';
import {Injectable} from '@angular/core';
import {QueryResult} from '../models/query';

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  constructor(private http: HttpService) {}

  getQueryResult(query: string): Promise<QueryResult> {
    return this.http.post('/sqlquery/executequery', { query, ExecutedInConsole: 1 }).then(data => {
      const queryResult = new QueryResult();
      queryResult.data = data;
      return queryResult;
    });
  }
}
