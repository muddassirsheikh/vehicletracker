import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export class Track {
  Id: number;
  VehicleId: number;
  Lattitude:number;
  Longitude:number;
  Date:Date;
}

@Injectable()
export class DataService {
  private header: HttpHeaders;

  constructor(private http: HttpClient) {
    this.header = new HttpHeaders({'Content-Type': 'application/json'});
  }

  getVehicles() {
    // return this.http.get<RepoSearchList>('https://apivehicletracker.azurewebsites.net/vehicle', { params });
    return this.http.get('https://apivehicletracker.azurewebsites.net/vehicle')
    .pipe(map(response => {return response;}),
    catchError(this.handleError));
  }

  getVehicle(id:any) {
    // return this.http.get<RepoSearchList>('https://apivehicletracker.azurewebsites.net/vehicle', { params });
    return this.http.get('https://apivehicletracker.azurewebsites.net/vehicle/'+id)
    .pipe(map(response => {return response;}),
    catchError(this.handleError));
  }

  scanVehicle(id:any, lat:number, long:number){
    console.log('track');
    var track = new Track();
    track.Id = 1;
    track.VehicleId = id;
    track.Lattitude = lat;
    track.Longitude = long;
    track.Date = new Date();
    console.log(track);
    return this.http.post('https://apivehicletracker.azurewebsites.net/vehicle', track, {headers: this.header})
    .pipe(map(response => {return response;}),
    catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse){
    console.log(error.message);
    return throwError('data error');
  }
}
