import { TestBed } from '@angular/core/testing';

import { FormcommunicationService } from './formcommunication.service';

describe('FormcommunicationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormcommunicationService = TestBed.get(FormcommunicationService);
    expect(service).toBeTruthy();
  });
});
