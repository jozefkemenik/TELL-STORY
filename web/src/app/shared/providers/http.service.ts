import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {ConfigService} from './config.service'


import {CookieService} from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class HttpService {


  constructor(private http: HttpClient, private configService: ConfigService, private cookieService: CookieService) {
  }

  private getToken() {
    var cu = this.cookieService.get('currentUser');
    if (cu) {
      return JSON.parse(cu) ? JSON.parse(cu).token : undefined;
    }
  }

  private getHeader(isGet: boolean = false) {
    let token = this.getToken();
    let header = {'Access-Control-Allow-Origin': '*'};

    header['Content-type'] = 'application/json';

    if (token) {
      header['Authorization'] = 'Bearer ' + token;
    }
    return header;
  }

  post(url: string, payload: any): Promise<any> {
    url = this.configService.config.serverUrl.replace(/\/+$/, '') + '/' + url.replace(/^\/+/, '');

    return this.http.post<any>(url, payload, {headers: this.getHeader()})
      .toPromise();
  }

  delete(url: string, payload: any): Promise<any> {
    url = this.configService.config.serverUrl.replace(/\/+$/, '') + '/' + url.replace(/^\/+/, '');

    return this.http.delete<any>(url, {
      headers: this.getHeader(),
      params: payload
    })
      .toPromise();
  }

  get(url: string, payload: any, isTextResult: boolean = false): Promise<any> {
    url = this.configService.config.serverUrl.replace(/\/$/, '') + '/' + url.replace(/^\//, '');
    var rType: string = 'json';
    if (isTextResult) {
      return this.http.request('GET', url, {
        responseType: 'text',
        headers: this.getHeader(true),
        params: payload
      })
        .toPromise();
    }
    return this.http.get<any>(url, {
      headers: this.getHeader(true),
      params: payload
    })
      .toPromise();
  }

  getFileFromAssets(file): Promise<any> {
    file = file.replace(/\/\//g, '/');
    return this.http.get('/assets/' + file).toPromise()
  }
}
