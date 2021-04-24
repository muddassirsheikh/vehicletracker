import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { SanctumInterceptor } from './sanctum-interceptor';
import { BASE_URL } from './base-url-interceptor';
import { SANCTUM_PREFIX } from '../bootstrap/sanctum.service';

describe('SanctumInterceptor', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;

  const setBaseUrlAndSanctumPrefix = (baseUrl: string, sanctumPrefix: string) => {
    TestBed.overrideProvider(BASE_URL, { useValue: baseUrl });
    TestBed.overrideProvider(SANCTUM_PREFIX, { useValue: sanctumPrefix });

    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: BASE_URL, useValue: null },
        { provide: SANCTUM_PREFIX, useValue: null },
        { provide: HTTP_INTERCEPTORS, useClass: SanctumInterceptor, multi: true },
      ],
    });
  });

  afterEach(() => httpMock.verify());

  it('should get csrf cookie once', () => {
    setBaseUrlAndSanctumPrefix(null, null);

    http
      .post('/auth/login', { username: 'foo', password: 'bar' })
      .pipe(switchMap(() => http.get('/me')))
      .subscribe();

    httpMock.expectOne('/sanctum/csrf-cookie').flush({ cookie: true });
    httpMock.expectOne('/auth/login').flush({ login: true });
    httpMock.expectOne('/me').flush({ me: true });
  });

  it('should get csrf cookie with base url', () => {
    setBaseUrlAndSanctumPrefix('http://foo.bar/api', null);

    http
      .post('/auth/login', { username: 'foo', password: 'bar' })
      .pipe(switchMap(() => http.get('/me')))
      .subscribe();

    httpMock.expectOne('http://foo.bar/sanctum/csrf-cookie').flush({ cookie: true });
    httpMock.expectOne('/auth/login').flush({ login: true });
    httpMock.expectOne('/me').flush({ me: true });
  });

  it('should get csrf cookie with sanctum prefix', () => {
    setBaseUrlAndSanctumPrefix(null, 'foobar');

    http
      .post('/auth/login', { username: 'foo', password: 'bar' })
      .pipe(switchMap(() => http.get('/me')))
      .subscribe();

    httpMock.expectOne('/foobar/csrf-cookie').flush({ cookie: true });
    httpMock.expectOne('/auth/login').flush({ login: true });
    httpMock.expectOne('/me').flush({ me: true });
  });

  it('should get csrf cookie with base url and sanctum prefix', () => {
    setBaseUrlAndSanctumPrefix('http://foo.bar/api', 'foobar');

    http
      .post('/auth/login', { username: 'foo', password: 'bar' })
      .pipe(switchMap(() => http.get('/me')))
      .subscribe();

    httpMock.expectOne('http://foo.bar/foobar/csrf-cookie').flush({ cookie: true });
    httpMock.expectOne('/auth/login').flush({ login: true });
    httpMock.expectOne('/me').flush({ me: true });
  });
});
