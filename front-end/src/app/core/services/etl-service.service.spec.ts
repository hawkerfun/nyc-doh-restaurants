import { TestBed } from '@angular/core/testing';

import { EtlServiceService } from './etl-service.service';

describe('EtlServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EtlServiceService = TestBed.get(EtlServiceService);
    expect(service).toBeTruthy();
  });
});
