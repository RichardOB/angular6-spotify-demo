import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Angular6SpotifyComponent } from './angular6-spotify.component';

describe('Angular6SpotifyComponent', () => {
  let component: Angular6SpotifyComponent;
  let fixture: ComponentFixture<Angular6SpotifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Angular6SpotifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Angular6SpotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
