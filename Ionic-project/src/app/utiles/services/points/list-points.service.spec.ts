import { TestBed } from '@angular/core/testing';

import { ListPointsService } from './list-points.service';

describe('ListPointsService', () => {
  let service: ListPointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListPointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
