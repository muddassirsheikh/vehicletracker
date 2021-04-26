import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {GeolocationService} from '@ng-web-apis/geolocation';
import { first, take } from 'rxjs/operators';
import {Map} from 'leaflet';
import * as L from 'leaflet';

import { DataService } from '../../shared/services/data.service';
import { MtxGridColumn } from '@ng-matero/extensions';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss',],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DataService],
})
export class VehicleDetailsComponent implements OnInit {
  private map: Map;
  private zoom: number;

  currentPosition: any;
  lat:any;
  lng:any;
  vehicleId:any;
  vehicle:any;

  ownerColumns: MtxGridColumn[];
  trackColumns: MtxGridColumn[];

  multiSelectable = true;
  rowSelectable = true;
  hideRowSelectionCheckbox = false;
  showToolbar = true;
  columnHideable = true;
  columnMovable = true;
  rowHover = false;
  rowStriped = false;
  showPaginator = true;
  expandable = false;
  columnResizable = false;

  constructor(private cdr: ChangeDetectorRef,
    private readonly geolocation$: GeolocationService,
    private ActivatedRoute: ActivatedRoute,
    private remoteSrv: DataService) {
    // geolocation$.subscribe(position => this.doSomethingWithPosition(position));

    // geolocation$.pipe(take(1)).subscribe(position => this.doSomethingWithPosition(position));

    this.ActivatedRoute.queryParamMap.subscribe(params => {
      this.vehicleId = params.get('id');
    })
    console.log(this.vehicleId);



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

addMarkers()
{
  let coord = L.latLng(0, 0);
  this.vehicle.tracks.forEach(track => {
    coord = L.latLng(track.lattitude, track.longitude);
    var marker = L.marker(coord).addTo(this.map);
  });

  this.map.setView(coord, 10);
}

  doSomethingWithPosition(position){
    console.log(position);
    this.currentPosition = position;
  }

  ngOnInit() {
    this.ownerColumns = [
      { header: 'Name', field: 'customer.name' },
      { header: 'Address', field: 'customer.address'},
      { header: 'Contact Number', field: 'customer.contactNumber' },
      { header: 'Licence Number', field: 'customer.licenceNumber' },
      { header: 'Start Date', field: 'startDate' },
      { header: 'End Date', field: 'endDate' },

    ];

    this.trackColumns = [
      { header: 'Date', field: 'date' },
      { header: 'Latitude', field: 'lattitude' },
      { header: 'Longitude', field: 'longitude'},
      {
        header: 'Operation',
        field: 'operation',
        minWidth: 120,
        width: '120px',
        pinned: 'right',
        type: 'button',
        buttons: [
          {
            type: 'icon',
            icon: 'location_on',
            tooltip: 'Locate',
            click: record => this.locate(record),
          }
        ],
      },
    ];

  }

  receiveMap(map: Map) {
    console.log('ready1');
    this.map = map;
    this.remoteSrv.getVehicle(this.vehicleId)
          .subscribe(
            (res:any) => {
              console.log(res);
              this.vehicle = res;
              this.addMarkers();
              this.cdr.detectChanges();
            },
            () => {
              this.cdr.detectChanges();
            },
            () => {
              this.cdr.detectChanges();
            }
          );
  }

  receiveZoom(zoom: number) {
    this.zoom = zoom;
  }

  changeSelect(e: any) {
    console.log(e);
  }

  changeSort(e: any) {
    console.log(e);
  }

  locate(track:any) {
    let coord = L.latLng(track.lattitude, track.longitude);
    this.map.setView(coord, 19);
  }
}
