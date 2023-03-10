import {AppModule} from './app/app.module';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        AppModule
    ],
    exports:[AppModule]
  })

export class MainModule {}
