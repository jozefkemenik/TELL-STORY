import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef
} from '@angular/core';
import {TableOptions} from '../../models/table-options.model';

@Component({
  selector: 'app-db-data-table',
  templateUrl: './db-data-table.component.html',
  styleUrls: ['./db-data-table.component.scss']
})
export class DbDataTableComponent {
  @Output() orderChange = new EventEmitter();
  @Output() loadMore = new EventEmitter();
  @Input()
  public options: TableOptions = new TableOptions();
  @Input()
  public tableData: object;
  @Input()
  public tableKeys: Array<string>;
  @Input()
  public tableHeaders: Array<string>;

  @Input()
  public loadMoreLoading = false;
  @Input()
  public loadMoreEnabled = false;

  private orderColumn: string = null;
  private orderDirection: string = null;

  @ContentChild('subheaderTemplate') subheaderTemplate: TemplateRef<any>;
  @ContentChild('subheaderTemplate2') subheaderTemplate2: TemplateRef<any>;

  scrollbarReachEnd() {
    if (this.options.loadMore && this.options.automaticLoadMore && this.loadMoreEnabled && !this.loadMoreLoading) {
      this.loadMore.emit();
    }
  }

  changeOrder(columnName): void {
    if (this.orderColumn === columnName) {
      if (this.orderDirection === 'ASC') {
        this.orderDirection = 'DESC';
      } else {
        this.orderColumn = null;
        this.orderDirection = null;
      }
    } else {
      this.orderColumn = columnName;
      this.orderDirection = 'ASC';
    }
    this.orderChange.emit({column: this.orderColumn, direction: this.orderDirection});
  }
}
