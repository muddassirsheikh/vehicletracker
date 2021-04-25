import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface RepoSearchList {
  incomplete_results: boolean;
  items: any[];
  total_count: number;
}

@Injectable()
export class TablesDataService {
  constructor(private http: HttpClient) {}

  getVehicles() {
    // return this.http.get<RepoSearchList>('https://apivehicletracker.azurewebsites.net/vehicle', { params });
    return this.http.get('https://apivehicletracker.azurewebsites.net/vehicle')
    .pipe(map(response => {return response;}),
    catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse){
    console.log(error.message);
    return throwError('data error');
  }
}
