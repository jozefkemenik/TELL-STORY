import { TestBed } from '@angular/core/testing';

import { WidgetGridService } from './widget-grid.service';

describe('WidgetGridService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WidgetGridService = TestBed.get(WidgetGridService);
    expect(service).toBeTruthy();
  });
});
