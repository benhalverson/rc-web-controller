import { TestBed } from '@angular/core/testing';

import { GamerpadService } from './gamerpad.service';

describe('GamerpadService', () => {
  let service: GamerpadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamerpadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
