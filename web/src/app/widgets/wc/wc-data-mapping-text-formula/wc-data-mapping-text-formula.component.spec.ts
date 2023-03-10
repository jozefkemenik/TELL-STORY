import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WcDataMappingTextFormulaComponent } from './wc-data-mapping-text-formula.component';

describe('WcDataMappingTextFormulaComponent', () => {
  let component: WcDataMappingTextFormulaComponent;
  let fixture: ComponentFixture<WcDataMappingTextFormulaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WcDataMappingTextFormulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WcDataMappingTextFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
