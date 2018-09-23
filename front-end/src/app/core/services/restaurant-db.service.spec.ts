import { TestBed } from '@angular/core/testing';

import { RestaurantDbService } from './restaurant-db.service';

describe('RestaurantDbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RestaurantDbService = TestBed.get(RestaurantDbService);
    expect(service).toBeTruthy();
  });
});
