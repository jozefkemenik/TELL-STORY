import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';





@NgModule({
  imports: [
    FormsModule,
    //BrowserModule,
    BrowserAnimationsModule,
    CommonModule
  ],
  declarations: [AppComponent],
  entryComponents: [AppComponent],
  providers: [{
     provide: 'plugins',
     useValue: [{
       name: 'AMCategoryChartBasic',
       component: AppComponent
     }],
     multi: true
   }]
})

export class AppModule { }