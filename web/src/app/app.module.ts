import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { CoreModule} from './core/core.module';

import { APP_INITIALIZER ,COMPILER_OPTIONS, CompilerFactory, Compiler, NgModule } from '@angular/core';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';

import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// features 

import {TranslationService} from './shared/providers/translation.service';
import {ConfigService} from './shared/providers/config.service';
import {HttpService} from './shared/providers/http.service';
import { PublishComponent } from './publish/publish.component';






export function TranslationProviderFactory(provider: TranslationService) {
  return () => provider.init();
}
export function ConfigProviderFactory(provider: ConfigService) {
  return () => provider.init();
}
export function createCompiler(fn: CompilerFactory): Compiler {     
  return fn.createCompiler();
}

@NgModule({
  declarations: [
    AppComponent,
    PublishComponent, 

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    CoreModule.forRoot(),
  ],
  providers: [
    HttpService,
    TranslationService,
    ConfigService,
    // resolve translation before app start
    {provide: APP_INITIALIZER, useFactory: ConfigProviderFactory, deps: [ConfigService], multi: true },
    {provide: APP_INITIALIZER, useFactory: TranslationProviderFactory, deps: [TranslationService], multi: true },
    ],

  bootstrap: [AppComponent]
})
export class AppModule { }
