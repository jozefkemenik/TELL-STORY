import {HttpService} from '../../shared/providers/http.service';
import {Injectable} from '@angular/core';
import {HistoryListResult} from '../models/history.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  constructor(private http: HttpService) {
  }

  getHistory(pageLength: number, page: number): Promise<HistoryListResult> {
    return this.http.get('/sqlQuery/getTopHistoryQueries', {
      limit: pageLength,
      offset: (page - 1) * pageLength
    }).then(data => {
      return data as HistoryListResult;
    });
  }
}
