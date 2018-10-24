import {Component, OnInit} from '@angular/core';
import {Angular6SpotifyService} from '../../projects/angular6-spotify/src/lib/angular6-spotify.service';
import {HashLocationStrategy, Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Location, {provide: HashLocationStrategy, useClass: PathLocationStrategy}],
})
export class AppComponent implements OnInit {
  title = 'angular6-spotify-demo';

  ngOnInit() {
    this.spotifyService.setAuthFromUrlCallback(this.location.path(true));
    this.search();
  }

  constructor(private spotifyService: Angular6SpotifyService, private location: Location) {
  }

  getArtist() {
    this.spotifyService.getArtists('me').subscribe((artist) => {
      console.log(JSON.stringify(artist));
    });
  }

  search() {
    this.spotifyService.search('PHCK', 'artist').subscribe((result) => {
      console.log(JSON.stringify(result));
    });
  }

  getSavedUserTracks() {
    this.spotifyService.getSavedUserTracks().subscribe((tracks) => {
      console.log(JSON.stringify(tracks));
    }, (error) => {
      this.login();
    });
  }

  login() {
    this.spotifyService.login().subscribe(
      token => {
        console.log(token);

      },
      err => console.error(err),
      () => {
      });
  }
}

