import { TestBed } from '@angular/core/testing';

import { Angular6SpotifyService } from './angular6-spotify.service';

describe('Angular6SpotifyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Angular6SpotifyService = TestBed.get(Angular6SpotifyService);
    expect(service).toBeTruthy();
  });
});
