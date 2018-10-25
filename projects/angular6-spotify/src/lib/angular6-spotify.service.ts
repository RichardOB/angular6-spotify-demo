import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import {DefaultUrlSerializer, UrlTree} from '@angular/router';
import {from} from 'rxjs';

import {SpotifyConfig} from './shared/spotify-config.interface';
import {SpotifyOptions} from './shared/spotify-options.interface';
import {HttpRequestOptions} from './shared/http-request-options.interface';

@Injectable({
  providedIn: 'root'
})
export class Angular6SpotifyService {

  constructor(@Inject('SpotifyConfig') private config: SpotifyConfig, private http: HttpClient) {
    config.apiBase = 'https://api.spotify.com/v1';
  }

  /* Public Data */

  /**
   * Get artists by artist id array
   * @param artists id of artist(s)
   */
  getArtists(artists: string | Array<string>) {
    const artistList = this.mountItemList(artists);
    return this.api({
      method: 'get',
      url: `/artists/`,
      search: {ids: artistList.toString()},
      headers: this.getHeaders()
    });
  }

  /**
   * Get albums for a specific artist
   * @param artist id of artist
   * @param options search options
   */
  getArtistAlbums(artist: string, options?: SpotifyOptions) {
    artist = this.getIdFromUri(artist);
    return this.api({
      method: 'get',
      url: `/artists/${artist}/albums`,
      search: options
    });
  }

  /**
   * Get list of top tracks for artist
   * @param artist id of artist
   * @param country origin country
   */
  getArtistTopTracks(artist: string, country: string) {
    artist = this.getIdFromUri(artist);
    return this.api({
      method: 'get',
      url: `/artists/${artist}/top-tracks`,
      search: { country: country }
    });
  }

  /**
   * Get list of related artists
   * @param artist id of artist
   */
  getRelatedArtists(artist: string) {
    artist = this.getIdFromUri(artist);
    return this.api({
      method: 'get',
      url: `/artists/${artist}/related-artists`
    });
  }

  /**
   * Get album by album id
   * @param album id of album
   */
  getAlbum(album: string) {
    album = this.getIdFromUri(album);
    return this.api({
      method: 'get',
      url: `/albums/${album}`
    });
  }

  /**
   * Get albums by album id array
   * @param albums id of album(s)
   */
  getAlbums(albums: string | Array<string>) {
    const albumList = this.mountItemList(albums);
    return this.api({
      method: 'get',
      url: `/albums`,
      search: { ids: albumList.toString() }
    });
  }

  /**
   * Get tracks for specific album
   * @param album id of album
   * @param options search options
   */
  getAlbumTracks(album: string, options?: SpotifyOptions) {
    album = this.getIdFromUri(album);
    return this.api({
      method: 'get',
      url: `/albums/${album}/tracks`,
      search: options
    });
  }

  /* Public Generic Data */

  /**
   * Get latest releases based on search options
   * @param options search options
   */
  getNewReleases(options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/browse/new-releases`,
      search: options,
      headers: this.getHeaders()
    });
  }

  /**
   * Get categories based on search options
   * @param options search options
   */
  getCategories(options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/browse/categories`,
      search: options,
      headers: this.getHeaders()
    });
  }

  /**
   * Get category by id and search options
   * @param categoryId id of category
   * @param options search options
   */
  getCategory(categoryId: string, options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/browse/categories/${categoryId}`,
      search: options,
      headers: this.getHeaders()
    });
  }

  /**
   * Get playlists matching category id
   * @param categoryId id of category
   * @param options search options
   */
  getCategoryPlaylists(categoryId: string, options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/browse/categories/${categoryId}/playlists`,
      search: options,
      headers: this.getHeaders()
    });
  }

  /**
   * Get recommendations based on search options
   * @param options search options
   */
  getRecommendations(options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/recommendations`,
      search: options,
      headers: this.getHeaders()
    });
  }

  /**
   * Get available genre seeds
   */
  getAvailableGenreSeeds () {
    return this.api({
      method: 'get',
      url: `/recommendations/available-genre-seeds`,
      headers: this.getHeaders()
    });
  }

  /**
   * Get albums for a specific artist
   * @param artist id of artist
   * @param options search options
   */
  getArtistAlbums(artist: string, options?: SpotifyOptions) {
    artist = this.getIdFromUri(artist);
    return this.api({
      method: 'get',
      url: `/artists/${artist}/albums`,
      search: options
    });
  }

  /**
   * Get list of top tracks for artist
   * @param artist id of artist
   * @param country origin country
   */
  getArtistTopTracks(artist: string, country: string) {
    artist = this.getIdFromUri(artist);
    return this.api({
      method: 'get',
      url: `/artists/${artist}/top-tracks`,
      search: { country: country }
    }).map(res => res.json());
  }

  /**
   * Get list of related artists
   * @param artist id of artist
   */
  getRelatedArtists(artist: string) {
    artist = this.getIdFromUri(artist);
    return this.api({
      method: 'get',
      url: `/artists/${artist}/related-artists`
    });
  }

  /**
   * Get album by album id
   * @param album id of album
   */
  getAlbum(album: string) {
    album = this.getIdFromUri(album);
    return this.api({
      method: 'get',
      url: `/albums/${album}`
    });
  }

  /**
   * Get albums by album id array
   * @param albums id of album(s)
   */
  getAlbums(albums: string | Array<string>) {
    const albumList = this.mountItemList(albums);
    return this.api({
      method: 'get',
      url: `/albums`,
      search: { ids: albumList.toString() }
    });
  }

  /**
   * Get tracks for specific album
   * @param album id of album
   * @param options search options
   */
  getAlbumTracks(album: string, options?: SpotifyOptions) {
    album = this.getIdFromUri(album);
    return this.api({
      method: 'get',
      url: `/albums/${album}/tracks`,
      search: options
    });
  }

  /* User Specific */

  getSavedUserTracks() {
    return this.api({
      method: 'get',
      url: `/me/tracks`,
      headers: this.getHeaders()
    });
  }

  /* General */

  /**
   * Search Spotify
   * q = search query
   * type = artist, album or track
   */
  search(q: string, type: string, options?: SpotifyOptions) {
    options = options || {};
    options.q = q;
    options.type = type;

    return this.api({
      method: 'get',
      url: '/search?' + this.toQueryString(options),
      search: options,
      headers: this.getHeaders()
    });
  }

  /* Authentication */

  /**
   * Open Spotify OAuth in separate Dialog
   */
  loginDialog() {
    const promise = new Promise((resolve, reject) => {
      const w = 400,
        h = 500,
        left = (screen.width / 2) - (w / 2),
        top = (screen.height / 2) - (h / 2);

      const params = {
        client_id: this.config.clientId,
        redirect_uri: this.config.redirectUri,
        scope: this.config.scope || '',
        response_type: 'token'
      };
      let authCompleted = false;
      const authWindow = this.openDialog(
        'https://accounts.spotify.com/authorize?' + this.toQueryString(params),
        'Spotify',
        'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=' + w + ',height=' + h + ',top=' + top + ',left=' + left,
        () => {
          if (!authCompleted) {
            return reject('Login rejected error');
          }
        }
      );
      const storageChanged = (e) => {
        if (e.key === 'angular2-spotify-token') {
          console.log('HERE');
          console.log(this.config.authToken);
          if (authWindow) {
            authWindow.close();
          }
          authCompleted = true;

          this.config.authToken = e.newValue;
          window.removeEventListener('storage', storageChanged, false);

          return resolve(e.newValue);
        }
      };
      window.addEventListener('storage', storageChanged, false);
    });

    return from(promise);
  }

  /**
   * Open Spotify OAuth through redirect
   */
  login() {
    const promise = new Promise((resolve, reject) => {
      const params = {
        client_id: this.config.clientId,
        redirect_uri: this.config.redirectUri,
        scope: this.config.scope || '',
        response_type: 'token'
      };
      let authCompleted = false;

      this.redirectToLogin(params);
      const storageChanged = (e) => {

        if (e.key === 'angular2-spotify-token') {
          authCompleted = true;

          this.config.authToken = e.newValue;
          window.removeEventListener('storage', storageChanged, false);

          return resolve(e.newValue);
        }
      };
      window.addEventListener('storage', storageChanged, false);
    });

    return from(promise);
  }

  /* Helper Functions */

  /**
   * Set auth token from url callback path
   * @param path url callback path
   */
  setAuthFromUrlCallback(path) {
    const serializer = new DefaultUrlSerializer();
    const urlObj: UrlTree = serializer.parse(this.convertHashToQueryParams(path));
    console.log(urlObj.queryParamMap.get('access_token'));
    this.setAuth(urlObj.queryParamMap.get('access_token'));
  }

  setAuth(auth) {
    this.config.authToken = auth;
  }

  getAuth() {
    return this.config.authToken;
  }

  /* Private */

  /**
   * Extract id from uri
   * @param uri string containing the id param
   */
  private getIdFromUri(uri: string) {
    return uri.indexOf('spotify:') === -1 ? uri : uri.split(':')[2];
  }

  private mountItemList(items: string | Array<string>): Array<string> {
    const itemList = Array.isArray(items) ? items : items.split(',');
    itemList.forEach((value, index) => {
      itemList[index] = this.getIdFromUri(value);
    });
    return itemList;
  }

  /**
   * Convert key value pair object to HttpParams
   * @param obj key value pair object
   * @return HttpParams
   */
  private toParams(obj: Object): HttpParams {
    const params: HttpParams = new HttpParams();
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        params.set(encodeURIComponent(key), encodeURIComponent(obj[key]));
      }
    }
    return params;
  }

  private api(requestOptions: HttpRequestOptions) {
    const method: string = requestOptions.method || 'GET';
    const url: string = this.config.apiBase + requestOptions.url;
    const body: string = JSON.stringify(requestOptions.body);
    return this.http.request(new HttpRequest(method, url, body, {
      headers: requestOptions.headers,
      params: this.toParams(requestOptions.search)
    }));
  }

  /**
   * Create header object excpected by Spotify api
   * @param isJson include json content type header
   */
  private auth(isJson?: boolean): Object {
    const auth = {
      'Authorization': 'Bearer ' + this.config.authToken
    };
    if (isJson) {
      auth['Content-Type'] = 'application/json';
    }
    return auth;
  }

  private getHeaders(isJson?: boolean): any {

    let headers = new HttpHeaders();

    const auth = this.auth(isJson);
    for (const key in auth) {
      if (auth.hasOwnProperty(key)) {
        headers = headers.append(key, auth[key]);
      }
    }

    return headers;
  }

  /**
   * Use window to open a dialog
   * @param uri uri to navigate to
   * @param name dialog name
   * @param options dialog specific config options
   * @param cb other
   */
  private openDialog(uri, name, options, cb) {
    const win = window.open(uri, name, options);
    const interval = window.setInterval(() => {
      try {
        if (!win || win.closed) {
          window.clearInterval(interval);
          cb(win);
        }
      } catch (e) {
      }
    }, 1000000);
    return win;
  }

  private redirectToLogin(params) {
    window.location.href = 'https://accounts.spotify.com/authorize?' + this.toQueryString(params);
  }

  /**
   * Convert key value pair object to query string
   * @param obj key value pair object
   * @return string
   */
  private toQueryString(obj: Object): string {
    const parts = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
      }
    }
    return parts.join('&');
  }

  /**
   * Convert hash returned by callback to query params so that the returned parameters are more easily accessible
   * @param hashUrl url hash string
   * @return string
   */
  private convertHashToQueryParams(hashUrl): string {
    const re = /#/g;
    return hashUrl.replace(re, '?');
  }
}
