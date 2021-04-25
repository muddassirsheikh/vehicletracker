import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import {Map} from 'leaflet';
import * as L from 'leaflet';

@Component({
  selector: 'app-vehicle-scan',
  templateUrl: './vehicle-scan.component.html',
  styleUrls: ['./vehicle-scan.component.scss',],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleScanComponent implements OnInit {
  private map: Map;
  private zoom: number;

  currentPosition: any;
  lat:any;
  lng:any;

  constructor(private cdr: ChangeDetectorRef) {
    if (navigator)
    {
      console.log('in navigator');
      navigator.geolocation.getCurrentPosition( pos => {
          this.lng = +pos.coords.longitude;
          this.lat = +pos.coords.latitude;
          let coord = L.latLng(this.lat, this.lng);
          var marker = L.marker(coord).addTo(this.map);
          this.map.setView(coord, 19);
      });
    }
  }


  ngOnInit() {}

  receiveMap(map: Map) {
    this.map = map;
  }

  receiveZoom(zoom: number) {
    this.zoom = zoom;
  }
}
