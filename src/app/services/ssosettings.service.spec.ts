import { TestBed } from '@angular/core/testing';

import { SSOSettingsService } from './ssosettings.service';

describe('SSOSettingsService', () => {
  let service: SSOSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SSOSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
