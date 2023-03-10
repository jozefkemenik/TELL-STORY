import { NgModule } from '@angular/core';

import { DatasetRoutingModule } from './dataset-routing.module';
import { ListComponent } from './pages/list/list.component';
import { CoreModule } from '../core/core.module';
import { DetailComponent } from './pages/detail/detail.component';
import { CreateComponent } from './pages/create/create.component';
import { ImportUrlComponent } from './components/import/import-url/import-url.component';
import { ImportFileComponent } from './components/import/import-file/import-file.component';

@NgModule({
  imports: [
    CoreModule,
    DatasetRoutingModule
  ],
  declarations: [
    ListComponent,
    DetailComponent,
    CreateComponent,
    ImportUrlComponent,
    ImportFileComponent
  ]
})
export class DatasetModule {
}
