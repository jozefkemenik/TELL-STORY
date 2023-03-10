import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetGridComponent } from './widget-grid/widget-grid.component';
import { WidgetGridService } from './widget-grid/widget-grid.service';
import { GridsterModule } from 'angular-gridster2';
import { WidgetSettingsComponent } from './widget-settings/widget-settings.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { WidgetFactoryComponent } from './widget-factory/widget-factory.component';
import { WidgetFactoryService } from './widget-factory/widget-factory.service'
import { WidgetDirective } from './widget-factory/widget.directive';
import { WCInputBoxComponent } from './wc/input-box/input-box.component';

import { WidgetService } from './widget.service';

import { WcDataMappingColumnChartService } from './wc/wc-data-mapping-column-chart/wc-data-mapping-chart.service';



import { WcDataMappingCategoriesComponent } from './wc/wc-data-mapping-column-chart/categories/wc-data-mapping-column-chart.component';
import { DdContentDataMappingComponent } from './wc/wc-data-mapping-column-chart/categories/dd-content-data-mapping/dd-content-data-mapping.component';

import { Ng5SliderModule } from 'ng5-slider';

import { WcDataMappingTextFormulaComponent } from './wc/wc-data-mapping-text-formula/wc-data-mapping-text-formula.component';


@NgModule({
  declarations: [WidgetGridComponent,
    WidgetSettingsComponent,
    WidgetFactoryComponent,
    WCInputBoxComponent,
    WidgetDirective,
    WcDataMappingCategoriesComponent,
    DdContentDataMappingComponent,
    WcDataMappingTextFormulaComponent,
  ],
  imports: [
    CommonModule,
    GridsterModule,
    SharedModule,
    ReactiveFormsModule,
    Ng5SliderModule
    
    
  ],
  entryComponents: [WCInputBoxComponent, WcDataMappingCategoriesComponent, WcDataMappingTextFormulaComponent],
  providers: [WidgetGridService, WidgetFactoryService, WidgetService, WcDataMappingColumnChartService],
  exports: [WidgetGridComponent, 
            WidgetSettingsComponent, 
            WidgetFactoryComponent],
})
export class WidgetsModule { }
