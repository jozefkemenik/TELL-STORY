import {
  AfterViewInit,
  AfterContentChecked,
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ApplicationRef
} from '@angular/core';
import * as ace from 'ace-builds';
import {QueryService} from '../services/query.service';
import {QueryResult} from '../models/query';
import {DatasetDetail} from '../models/dataset';
import {DatasetService} from '../services/dataset.service';
import {UserQueriesService} from '../services/userqueries.service';
import {HistoryService} from '../services/history.service';
import {TableOptions} from '../../shared/models/table-options.model';
import {SavedQuery} from '../models/savedQuery.model';
import {HistoryListResult} from '../models/history.model';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-dbconsole',
  templateUrl: './dbconsole.component.html',
  styleUrls: ['./dbconsole.component.scss']
})
export class DBConsoleComponent implements AfterViewInit, OnInit, AfterContentChecked {
  dbDataTableOptions = new TableOptions(false, true);
  historyTableOptions = new TableOptions(false, false, false, true, true);

  @ViewChild('editor') editor;
  @ViewChild('headingRow') headingRow;
  @ViewChild('card') card;
  @ViewChild('saveModal') saveModal;
  @ViewChild('confirmModal') confirmModal;
  @ViewChild('removeModal') removeModal;

  modalRef: BsModalRef;
  confirmModalRef: BsModalRef;

  options: any;

  private cardHeight;
  private sidebarHeight;
  private loading = false;
  private tableView = false;
  private query = '';
  private queryName = '';
  private queryResult: QueryResult = null;
  private queryError = '';
  private historyError = '';
  private tableKeys = null;
  // noinspection JSMismatchedCollectionQueryUpdate
  private savedQueries: Array<SavedQuery> = [];
  private savedQueriesError = '';
  private savedQueriesLoading = true;
  private queryToRemove = null;
  private history: HistoryListResult = new HistoryListResult();
  private historyPage = 1;
  private historyPageLength = 10;
  private historyLoadingMore = false;

  private datasets: Array<DatasetDetail> = [];

  constructor(
    private queryService: QueryService,
    private datasetService: DatasetService,
    private userQueriesService: UserQueriesService,
    private historyService: HistoryService,
    private modalService: BsModalService,
    private applicationRef: ApplicationRef
  ) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const headingRowStyle = window.getComputedStyle(this.headingRow.nativeElement);
    const headingRowHeight = parseFloat(headingRowStyle.marginBottom)
      + parseFloat(headingRowStyle.marginTop)
      + this.headingRow.nativeElement.offsetHeight;
    this.sidebarHeight = event.target.innerHeight
      - document.getElementsByClassName('top-menu-bar')[0].clientHeight;
    this.cardHeight = this.sidebarHeight
      - headingRowHeight
      - parseFloat(window.getComputedStyle(this.card.nativeElement).marginBottom);
  }

  ngAfterContentChecked() {
    this.onResize({target: window});
  }

  ngOnInit(): void {
    this.datasetService.getDatasets()
      .then((datasets) => {
        this.datasets = datasets;
      })
      .catch(() => {
      });

    this.loading = true;
    this.loadUserQueries();

    this.historyService.getHistory(this.historyPageLength, this.historyPage)
      .then((history) => {
        this.history = history;
      }).catch((error) => {
      this.historyError = error.error ? error.error : error.message;
    }).finally(() => {
      this.loading = false;
    });
  }

  loadUserQueries() {
    this.savedQueriesError = '';
    this.savedQueriesLoading = true;
    return this.userQueriesService.getQueries().then((savedQueries) => {
      this.savedQueries = savedQueries;
    }).catch(() => {
      this.savedQueriesError = 'Cant load queries';
    }).finally(() => {
      this.savedQueriesLoading = false;
    });
  }

  ngAfterViewInit(): void {
    ace.require('ace/ext/language_tools');
    this.editor.setTheme('eclipse');

    this.editor.getEditor().setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      fontSize: '12pt'
    });
    const command = {
      name: 'showOtherCompletions',
      bindKey: 'Ctrl-Enter',
      exec: () => {
        this.executeQuery.call(this);
      }
    };
    this.editor.getEditor().commands.addCommand(command);
    this.editor.getEditor().commands.on('afterExec', (e) => {
      if (e.command.name === 'insertstring' && /^[\w.]$/.test(e.args)) {
        this.editor.getEditor().execCommand('startAutocomplete');
      }
    });
    this.editor.getEditor().completers = [
      {
        getCompletions(editor, session, pos, prefix, callback) {
          if (session.$mode.completer) {
            return session.$mode.completer.getCompletions(editor, session, pos, prefix, callback);
          }
          const state = editor.session.getState(pos.row);
          let keywordCompletions;
          if (prefix === prefix.toUpperCase()) {
            keywordCompletions = session.$mode.getCompletions(state, session, pos, prefix);
            keywordCompletions = keywordCompletions.map((obj) => {
              const copy = obj;
              copy.value = obj.value.toUpperCase();
              return copy;
            });
          } else {
            keywordCompletions = session.$mode.getCompletions(state, session, pos, prefix);
          }
          return callback(null, keywordCompletions);
        },
      },
      {
        getCompletions: (editor, session, pos, prefix, callback) => {
          let datasetAlias: string = session.getTextRange(new ace.Range(pos.row, 0, pos.row, pos.column));
          datasetAlias = datasetAlias.split(' ').pop();
          if (datasetAlias[datasetAlias.length - prefix.length - 1] === '.') {
            const datasetAliasTmp = datasetAlias.split('.');
            datasetAliasTmp.pop();
            datasetAlias = datasetAliasTmp.join('.');
          } else {
            datasetAlias = null;
          }
          callback(null, [].concat(...this.datasets.map((dataset) => {
            const datasetCompletion = dataset.datasetName
              ? [
                {
                  caption: dataset.datasetName + ' (Name)',
                  value: '[' + dataset.datasetUID + '] as ' + dataset.datasetName.replace(/[\W]+/g, '_').replace(/_$/, ''),
                  meta: 'Table name'
                },
                {
                  caption: dataset.datasetName + ' (Alias)',
                  value: dataset.datasetName.replace(/[\W]+/g, '_').replace(/_$/, ''),
                  meta: 'Table alias'
                }
              ]
              : [
                {
                  caption: dataset.datasetUID + ' (Name)',
                  value: '[' + dataset.datasetUID + ']',
                  meta: 'Table name'
                }
              ];

            const columnCompletion = datasetAlias
              ? this.datasets
                .filter((tmpDataset) => {
                  return (tmpDataset.datasetName.replace(/[\W]+/g, '_').replace(/_$/, '') === datasetAlias);
                })
                .map((tmpDataset) => {
                  return tmpDataset.datasetColumns.map((column) => {
                    return {
                      caption: column.columnName + ' (Column)',
                      value: column.columnName,
                      meta: 'Column name'
                    };
                  });
                })
              : [];
            return datasetCompletion.concat(...columnCompletion);
          })));
        }
      }
    ];
  }

  executeQuery() {
    if (this.query !== '') {
      this.historyPage = 1;
      this.loading = true;
      this.queryError = '';
      this.historyError = '';
      this.queryResult = null;
      this.tableKeys = null;
      this.queryService.getQueryResult(this.sanitizeQuery(this.query))
        .then((queryResult) => {
          this.queryResult = queryResult;
          this.tableKeys = Object.keys(queryResult.data);
        })
        .catch((error) => {
          this.queryError = error.error.message ? error.error.message : error.message;
        })
        .finally(() => {
          this.loading = false;
          this.loading = true;
          this.historyService.getHistory(this.historyPageLength, this.historyPage)
            .then((history) => {
              this.history = history;
            }).catch((error) => {
            this.historyError = error.error ? error.error : error.message;
          }).finally(() => {
            if (this.queryError === '') {
              this.tableView = true;
            }
            this.loading = false;
          });
        });
    }
  }

  sanitizeQuery(query: string) {
    query = this.query.replace(/(?:\r\n|\r|\n)/g, ' ').trim();
    query = query.trim().slice(-1) === ';' ? query.slice(0, -1) : query;
    query = query.includes(';') ? query.split(';')[0] : query;
    const tmp = query.toLowerCase();
    if (!tmp.includes('limit') && !tmp.includes('show tables')) {
      query = query + ' LIMIT 20';
    }
    return query + ';';
  }

  saveQuery() {
    this.queryToRemove = this.savedQueries.find(obj => obj.name === this.queryName);
    if (this.queryToRemove) {
      this.confirmModalRef = this.modalService.show(this.confirmModal);
      return;
    }
    if (this.query !== '') {
      this.savedQueriesLoading = true;
      this.userQueriesService.saveQuery(this.query, this.queryName).then(() => {
        this.loadUserQueries();
      }).catch(() => {
        this.savedQueries = [];
        this.savedQueriesLoading = false;
      });
    }
    this.hideModal(this.modalRef);
  }

  removeQuery(id) {
    this.savedQueriesLoading = true;
    this.userQueriesService.removeQuery(id).then(() => {
      this.loadUserQueries().finally(() => {
        this.queryToRemove = null;
      });
    }).catch(() => {
      this.savedQueries = [];
      this.savedQueriesLoading = false;
      this.queryToRemove = null;
    });
    this.hideModal(this.modalRef);
  }

  replaceQuery(item) {
    this.savedQueriesLoading = true;
    this.userQueriesService.removeQuery(item.id).then(() => {
      this.userQueriesService.saveQuery(this.query, this.queryName).then(() => {
        this.loadUserQueries().finally(() => {
          this.queryToRemove = null;
        });
      }).catch(() => {
        this.savedQueries = [];
        this.savedQueriesLoading = false;
        this.queryToRemove = null;
      });
    }).catch(() => {
      this.savedQueries = [];
      this.savedQueriesLoading = false;
      this.queryToRemove = null;
    });
    this.hideModal(this.confirmModalRef);
    this.hideModal(this.modalRef);
  }

  showModal(modal): void {
    this.queryName = '';
    this.modalRef = this.modalService.show(modal);
  }

  showRemoveModal(item) {
    this.queryToRemove = item;
    this.showModal(this.removeModal);
  }

  hideModal(modalRef): void {
    modalRef.hide();
  }

  tableHeaders() {
    return this.tableKeys.map((key) => {
      return key.replace(/[\w\-]*\./, '');
    });
  }

  historyHeaders() {
    return this.history.queries.length === 0 ? [] : Object.keys(this.history.queries[0]).filter((header) => {
      return header !== 'id';
    });
  }

  loadMoreHistory() {
    this.historyLoadingMore = true;
    this.historyPage++;
    this.applicationRef.tick();
    this.historyService.getHistory(this.historyPageLength, this.historyPage).then((history) => {
      this.history.queries = this.history.queries.concat(history.queries);
      this.history.totalRecords = history.totalRecords;
    }).finally(() => {
      this.historyLoadingMore = false;
      this.applicationRef.tick();
    });
  }
}
