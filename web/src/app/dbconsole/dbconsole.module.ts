import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DBConsoleComponent} from './pages/dbconsole.component';
import {DBConsoleRoutingModule} from './dbconsole-routing.module';
import {AceEditorModule} from 'ng2-ace-editor';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    DBConsoleRoutingModule,
    AceEditorModule,
    SharedModule,
    FormsModule
  ],
  declarations: [
    DBConsoleComponent
  ],
  providers: []
})

export class DBConsoleModule {
}
