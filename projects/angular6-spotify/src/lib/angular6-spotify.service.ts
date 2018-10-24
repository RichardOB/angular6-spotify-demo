import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import {from} from 'rxjs';
import {DefaultUrlSerializer, UrlTree} from '@angular/router';

export interface SpotifyConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
  authToken?: string;
  apiBase: string;
}

export interface SpotifyOptions {
  limit?: number;
  offset?: number;
  market?: string;
  album_type?: string;
  country?: string;
  type?: string;
  q?: string;
  timestamp?: string
  locale?: string;
  public?: boolean;
  name?: string;
  time_range?: string;
  after?: string;
  before?: string;
}

interface HttpRequestOptions {
  method?: string;
  url: string;
  search?: Object;
  body?: Object;
  headers?: HttpHeaders;
}

@Injectable({
  providedIn: 'root'
})
export class Angular6SpotifyService {

  constructor(@Inject('SpotifyConfig') private config: SpotifyConfig, private http: HttpClient) {
    config.apiBase = 'https://api.spotify.com/v1';
  }

  getArtists(artists: string | Array<string>) {
    const artistList = this.mountItemList(artists);
    return this.api({
      method: 'get',
      url: `/artists/`,
      search: {ids: artists.toString()},
      headers: this.getHeaders()
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

  private toQueryString(obj: Object): string {
    const parts = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
      }
    }
    return parts.join('&');
  }

  private convertHashToQueryParams(hashUrl): string {
    const re = /#/g;
    return hashUrl.replace(re, '?');
  }
}
