import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

import { MtxGridColumn } from '@ng-matero/extensions';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { DataService } from '../../services/data.service';
import { TranslateService } from '@ngx-translate/core';

import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DataService],
})
export class DataGridComponent implements OnInit {
  @ViewChild('selectTpl', {static: true}) selectTpl: TemplateRef<any>;

  list = [];
  total = 0;
  isLoading = true;
  columns: MtxGridColumn[];

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

  query = {
    q: 'user:nzbin',
    sort: 'stars',
    order: 'desc',
    page: 0,
    per_page: 10,
  };

  get params() {
    const p = Object.assign({}, this.query);
    p.page += 1;
    return p;
  }

  constructor(private translate: TranslateService,
    public dialog: MtxDialog,
    private remoteSrv: DataService,
    private cdr: ChangeDetectorRef,
    private router: Router) {}

  ngOnInit() {
    this.columns = [
      { header: 'Id', field: 'id', type: 'number' },
      { header: 'Make', field: 'make' },
      { header: 'Model', field: 'model'},
      { header: 'Color', field: 'color' },
      { header: 'Chassis Number', field: 'chasisNumber' },
      { header: 'Engine Number', field: 'engineNumber' },
      { header: 'Registration Number', field: 'registrationNumber' },
      { header: 'IsFlagged', field: 'isFlagged', type: 'boolean', cellTemplate: this.selectTpl  },
      {
        header: this.translate.stream('table_kitchen_sink.operation'),
        field: 'operation',
        minWidth: 120,
        width: '120px',
        pinned: 'right',
        type: 'button',
        buttons: [
          {
            type: 'icon',
            icon: 'more',
            tooltip: this.translate.stream('More Details'),
            click: record => this.edit(record),
          }
        ],
      },
    ];

    this.getData();
  }

  edit(vehicle: any) {
    // const dialogRef = this.dialog.originalOpen(MapComponent, {
    //   width: '600px',
    //   height: '600px',
    //   data: { record: value },
    // });

    // dialogRef.afterClosed().subscribe(() => console.log('The dialog was closed'));
    this.router.navigate(['/details'], { queryParams: { id: vehicle.id }});
  }

  getData() {
    this.isLoading = true;

    this.remoteSrv.getVehicles().subscribe(
      (res:any) => {
        console.log(res);
        this.list = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    );
  }

  getNextPage(e: PageEvent) {
    this.query.page = e.pageIndex;
    this.query.per_page = e.pageSize;
    this.getData();
  }

  search() {
    this.query.page = 0;
    this.getData();
  }

  changeSelect(e: any) {
    console.log(e);
  }

  changeSort(e: any) {
    console.log(e);
  }

  enableRowExpandable() {
    this.columns[0].showExpand = this.expandable;
  }

  updateCell() {
    this.list = this.list.map(item => {
      item.weight = Math.round(Math.random() * 1000) / 100;
      return item;
    });
  }

  updateList() {
    this.list = this.list.splice(-1).concat(this.list);
  }
}
