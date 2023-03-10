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
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Output() loadMore = new EventEmitter();
  @Output() rowClick = new EventEmitter();

  @Input()
  public options: TableOptions = new TableOptions();
  @Input()
  public tableData: Array<object>;
  @Input()
  public tableKeys: Array<string>;
  @Input()
  public tableHeaders: Array<string>;
  @Input()
  public loadMoreLoading = false;
  @Input()
  public loadMoreEnabled = false;

  @ContentChild('customDataColumnTemplate') customDataColumnTemplate: TemplateRef<any>;
  @ContentChild('customActionColumnTemplate') customActionColumnTemplate: TemplateRef<any>;

  scrollbarReachEnd() {
    if (this.options.loadMore && this.options.automaticLoadMore && this.loadMoreEnabled && !this.loadMoreLoading) {
      this.loadMore.emit();
    }
  }
}
