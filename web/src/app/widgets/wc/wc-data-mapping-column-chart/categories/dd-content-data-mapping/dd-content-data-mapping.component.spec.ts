import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdContentDataMappingComponent } from './dd-content-data-mapping.component';

describe('DdContentDataMappingComponent', () => {
  let component: DdContentDataMappingComponent;
  let fixture: ComponentFixture<DdContentDataMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdContentDataMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdContentDataMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
