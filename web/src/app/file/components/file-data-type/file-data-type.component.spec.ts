import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDataTypeComponent } from './file-data-type.component';

describe('FileDataTypeComponent', () => {
  let component: FileDataTypeComponent;
  let fixture: ComponentFixture<FileDataTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileDataTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDataTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
