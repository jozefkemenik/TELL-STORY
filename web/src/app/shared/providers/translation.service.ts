import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})


export class TranslationService {

  dictionary: object;
  // this should be replace with API, with http service instead httpClient
  readonly configUrl = '/assets/lang.json';
  language: string = 'en';
  constructor(private http: HttpClient, private https: HttpService) {
  }

  init() {
    return this.http.get(this.configUrl).toPromise()
      .then((r) => {
        this.dictionary = r;
         this.https.get('/resources/getResources', null).then(rs => {
          for(var i in rs){
            for(var ii in rs[i]){
              this.dictionary[i][ii]  = rs[i][ii]
            }
          }
  
          return true;
        },
          () => {
            return false;
          }
        );

      })
  }


  getTranslation(key: string): string {
    if (key && key.length > 0) {
      if (key.startsWith('#')) {
        key = 't_' + key.substring(1, key.length);
      }
      return this.dictionary[this.language][key] ? this.dictionary[this.language][key] : '*' + key;
    }
  }
}
