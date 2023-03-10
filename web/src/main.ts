import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

declare const FontAwesomeConfig;
FontAwesomeConfig.autoReplaceSvg = 'nest';

declare const SystemJS;


import * as angularCore from '@angular/core';
import * as angularCommon from '@angular/common';
import * as angularForms from '@angular/forms';

import * as flexModule from '@angular/flex-layout';
import * as ngxBootstrap from 'ngx-bootstrap';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as BrowserModule from '@angular/platform-browser';
import * as BrowserAnimationsModule from '@angular/platform-browser/animations';

am4core.useTheme(am4themes_animated);

SystemJS.set('ngx-bootstrap', SystemJS.newModule(ngxBootstrap));
SystemJS.set('@angular/core', SystemJS.newModule(angularCore));
SystemJS.set('@angular/common', SystemJS.newModule(angularCommon));
SystemJS.set('@angular/forms', SystemJS.newModule(angularForms));
SystemJS.set('@angular/platform-browser', SystemJS.newModule(BrowserModule));
SystemJS.set('@angular/flex-layout', SystemJS.newModule(flexModule));
SystemJS.set('@angular/platform-browser/animations', SystemJS.newModule(BrowserAnimationsModule));

// inject amCharts modules jsut for widgets
SystemJS.set('@amcharts/amcharts4/core', SystemJS.newModule(am4core));
SystemJS.set('@amcharts/amcharts4/charts', SystemJS.newModule(am4charts));
SystemJS.set('@amcharts/amcharts4/themes/animated', SystemJS.newModule(am4themes_animated));

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
