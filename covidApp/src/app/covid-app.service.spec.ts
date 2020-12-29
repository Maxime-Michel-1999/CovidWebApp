import { TestBed } from '@angular/core/testing';

import { CovidAppServices } from './covid-app.service';

describe('CovidAppService', () => {
  let service: CovidAppServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CovidAppServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
