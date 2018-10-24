import {HttpHeaders} from '@angular/common/http';

export interface HttpRequestOptions {
  method?: string;
  url: string;
  search?: Object;
  body?: Object;
  headers?: HttpHeaders;
}
