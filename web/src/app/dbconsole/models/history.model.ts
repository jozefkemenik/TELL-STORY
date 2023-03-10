export class HistoryQuery {
  query: string;
  created: string;
  executionTime: string;
  id: string;
}

export class HistoryListResult {
  queries: Array<HistoryQuery> = [];
  totalRecords = 0;
}
