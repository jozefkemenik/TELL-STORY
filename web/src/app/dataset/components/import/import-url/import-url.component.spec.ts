import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportUrlComponent } from './import-url.component';

describe('ImportUrlComponent', () => {
  let component: ImportUrlComponent;
  let fixture: ComponentFixture<ImportUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportUrlComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
