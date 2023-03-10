import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-load-more-button',
  templateUrl: './load-more-button.component.html',
  styleUrls: ['./load-more-button.component.scss']
})
export class LoadMoreButtonComponent {
  @Input()
  loadMoreLoading = false;
  @Input()
  loadMoreEnabled = false;
  @Output()
  loadMore = new EventEmitter();
}

