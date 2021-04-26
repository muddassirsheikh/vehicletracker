import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {GeolocationService} from '@ng-web-apis/geolocation';
import { first, take } from 'rxjs/operators';
import {Map} from 'leaflet';
import * as L from 'leaflet';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss',],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private map: Map;
  private zoom: number;

  currentPosition: any;
  lat:any;
  lng:any;

  constructor(private cdr: ChangeDetectorRef,
    private router: Router,
    private readonly geolocation$: GeolocationService) {
    // geolocation$.subscribe(position => this.doSomethingWithPosition(position));
    // geolocation$.pipe(take(1)).subscribe(position => this.doSomethingWithPosition(position));

    // if (navigator)
    // {
    //   console.log('in navigator');
    //   navigator.geolocation.getCurrentPosition( pos => {
    //       this.lng = +pos.coords.longitude;
    //       this.lat = +pos.coords.latitude;
    //       let coord = L.latLng(this.lat, this.lng);
    //       var marker = L.marker(coord).addTo(this.map);
    //       this.map.setView(coord, 19);
    //   });
    // }
  }

//   getPosition() {
//     this.geolocation$.subscribe(position =>
//      this.doSomethingWithPosition(position));
// }

  doSomethingWithPosition(position){
    console.log(position);
    this.currentPosition = position;
  }

  ngOnInit() {}

  receiveMap(map: Map) {
    this.map = map;
  }

  receiveZoom(zoom: number) {
    this.zoom = zoom;
  }
}
