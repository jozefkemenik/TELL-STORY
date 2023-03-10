import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSeparatorComponent } from './file-separator.component';

describe('FileSeparatorComponent', () => {
  let component: FileSeparatorComponent;
  let fixture: ComponentFixture<FileSeparatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileSeparatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSeparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
