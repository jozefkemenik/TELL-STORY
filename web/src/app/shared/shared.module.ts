import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { TranslatePipe } from './translate.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { MockInterceptor } from '../mock/mock.interceptor';
import { NgInitDirective } from './directives/ng-init.directive';
import { FixStyleDirective} from './directives//fix.style';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SwitchBarComponent } from './components/switch-view-type/switch-bar.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { InputBarComponent } from './components/input-bar/input-bar.component';
import { LoadingComponent } from './components/loading/loading.component';
import { DbDataTableComponent } from './components/db-data-table/db-data-table.component';
import { TableComponent } from './components/table/table.component';
import { LoadMoreButtonComponent } from './components/load-more-button/load-more-button.component';
import { DatatypeBadgeComponent } from './components/datatype-badge/datatype-badge.component';
import {CheckboxComponent} from './components/checkbox/checkbox.component';
import { InfiniteScrollComponent} from './components/infinite-scroll/infinite-scroll.component';
import { DatasetListComponent } from './components/dataset-list/dataset-list.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,

    TabsModule.forRoot(),
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
  ],
  declarations: [
    NgInitDirective,
    FixStyleDirective,
    TranslatePipe,
    ProgressBarComponent,
    SwitchBarComponent,
    SearchBarComponent,
    InputBarComponent,
    LoadingComponent,
    DbDataTableComponent,
    TableComponent,
    LoadMoreButtonComponent,
    DatatypeBadgeComponent,
    CheckboxComponent,
    InfiniteScrollComponent,
    DatasetListComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockInterceptor,
      multi: true
    }
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    HttpClientModule,
    TranslatePipe,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,

    TabsModule,
    CollapseModule,
    BsDropdownModule,
    ProgressBarComponent,
    PaginationModule,
    BsDatepickerModule,
    ModalModule,
    NgInitDirective,
    FixStyleDirective,
    ProgressBarComponent,
    SwitchBarComponent,
    SearchBarComponent,
    InputBarComponent,
    LoadingComponent,
    DbDataTableComponent,
    TableComponent,
    DatatypeBadgeComponent,
    CheckboxComponent,
    InfiniteScrollComponent,
    DatasetListComponent
  ]
})
export class SharedModule {
  constructor() {
  }
}
