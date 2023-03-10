export class TableOptions {
  constructor(
    public sortable: boolean = false,
    public border: boolean = false,
    public header: boolean = true,
    public loadMore: boolean = false,
    public automaticLoadMore: boolean = false
  ) {}
}
