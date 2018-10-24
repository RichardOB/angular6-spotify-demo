import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {Angular6SpotifyModule} from 'angular6-spotify';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule, Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    Angular6SpotifyModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    {
      provide: 'SpotifyConfig', useValue: {
        clientId: '<spotify-client-id>',
        redirectUri: 'http://localhost:4200/',
        scope: 'user-follow-modify user-follow-read playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-library-read user-library-modify user-read-private'
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
