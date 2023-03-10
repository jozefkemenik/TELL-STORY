import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment'

const FIXTURES = [
  {
    url: 'login',
    mock: null
  },
  {
    url:'createStory',
    mock: null
  }
  ,
  {
    url: 'loadWidgetTypes',
    mock: null
  },
  {
    url: 'getResources',
    mock: {}
  },
  {
    url: 'loadStory',
    mock: null
  },
  {
    url: 'getDataset',
    mock: null
  },
  {
    url: 'getUserDatasets',
    mock: null
  },
  {
    url: 'createWidget',
    mock: null
  },
  {
    url: 'loadConfiguration',
    mock: null
  },
  {
    url: 'loadStories',
    mock: null
  },
  {
    url: 'executequery',
    mock: null
  }
];

@Injectable()
export class MockInterceptor implements HttpInterceptor {
  private cache = new Map<string, any>();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (environment.mock) {
      var fixture = null;
      FIXTURES.forEach(f => {
        if (new RegExp('\\b' + f.url.toLowerCase() + '\\b').test(request.url.toLowerCase())) {
          fixture = f;;
        }
      });

      if (fixture) {
        if (fixture.mock) {
          return of(new HttpResponse({ status: 200, body: fixture.mock }));
        } else {
          var hr = new HttpRequest<any>('GET', '/assets/mock/fixtures/' + fixture.url + '.json');
          return next.handle(hr);
        }
      }
    }
    return next.handle(request);
  }
}




