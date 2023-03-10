import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FileUploadWizardComponent } from './components/file-upload-wizard/file-upload-wizard.component';
import { FileSeparatorComponent} from './components/file-separator/file-separator.component';
import { FileDataTypeComponent} from './components/file-data-type/file-data-type.component';


@NgModule({
  declarations: [FileUploadComponent, 
    FileUploadWizardComponent,
    FileSeparatorComponent,
    FileDataTypeComponent
  ],
  imports: [
    CommonModule
  ]
})
export class FileModule { }
