import { TestBed } from '@angular/core/testing';

import { TransferdataService } from './transferdata.service';

describe('TransferdataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransferdataService = TestBed.get(TransferdataService);
    expect(service).toBeTruthy();
  });
});
