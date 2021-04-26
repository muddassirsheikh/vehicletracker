import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Map} from 'leaflet';
import * as L from 'leaflet';

import { DataService } from '../../../shared/services/data.service';

@Component({
  selector: 'app-vehicle-scan',
  templateUrl: './vehicle-scan.component.html',
  styleUrls: ['./vehicle-scan.component.scss',],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DataService],
})
export class VehicleScanComponent implements OnInit {
  private map: Map;
  private zoom: number;

  currentPosition: any;
  lat:any;
  lng:any;
  vehicleId: any;
  vehicle:any;

  constructor(private cdr: ChangeDetectorRef, private ActivatedRoute: ActivatedRoute, private remoteSrv: DataService) {

    this.ActivatedRoute.queryParamMap.subscribe(params => {
      this.vehicleId = params.get('id');
    })
console.log(this.vehicleId);

    if (navigator)
    {
      console.log('in navigator');
      navigator.geolocation.getCurrentPosition( pos => {
          this.lng = +pos.coords.longitude;
          this.lat = +pos.coords.latitude;
          let coord = L.latLng(this.lat, this.lng);
          //var marker = L.marker(coord).addTo(this.map);
          //this.map.setView(coord, 19);

          this.remoteSrv.scanVehicle(this.vehicleId, this.lat, this.lng)
          .subscribe(
            (res:any) => {
              console.log(res);
              this.vehicle = res;
              this.cdr.detectChanges();
            },
            () => {
              this.cdr.detectChanges();
            },
            () => {
              this.cdr.detectChanges();
            }
          );
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
