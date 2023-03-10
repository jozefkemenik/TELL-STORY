import {HttpService} from '../../shared/providers/http.service';
import {Injectable} from '@angular/core';
import {SavedQuery} from '../models/savedQuery.model';

@Injectable({
  providedIn: 'root'
})
export class UserQueriesService {
  constructor(private http: HttpService) {
  }

  saveQuery(query, name) {
    return this.http.post('/sqlquery/saveQuery', {query, name });
  }

   removeQuery(id) {
    return this.http.post('/sqlquery/deleteQuery', {id});
  }

  getQueries(): Promise<Array<SavedQuery>> {
    return this.http.get('/sqlQuery/getTopQueries', null).then(data => {
      return data as Array<SavedQuery>;
    });
  }
}
