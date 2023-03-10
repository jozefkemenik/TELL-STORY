import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resolve } from '@angular/router';
export class Config {
  public serverUrl: string;
}
@Injectable()
export class ConfigService implements Resolve<any>{
  private readonly configUrl = '/assets/config.json';
  public config: Config;
  constructor(private http: HttpClient) { }
  resolve() {
    return this.init();
  }
  public init(): Promise<boolean> {
    return this.http.get(this.configUrl)
      .toPromise()
      .then((r) => {
        this.config = r as Config;
        return true;
      },
        () => { return false; }
      );
  }
}
