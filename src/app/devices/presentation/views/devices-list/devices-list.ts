import {AfterViewChecked, Component, computed, inject, ViewChild} from '@angular/core';
import {DevicesStore} from '../../../application/devices.store';
import {Router} from '@angular/router';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginator} from '@angular/material/paginator';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {TranslatePipe} from '@ngx-translate/core';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatError} from '@angular/material/input';

/**
 * Component that displays a list of devices.
 * It includes a table with columns for device details, including MAC address, assigned supply, network state, and sensor health.
 * It also includes sorting and pagination controls.
 */
@Component({
  selector: 'app-devices-list',
  imports: [
    MatSort,
    MatPaginator,
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
    MatProgressSpinner,
    MatError,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatSortHeader,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
  ],
  templateUrl: './devices-list.html',
  styleUrls: ['./devices-list.css'],
})
export class DevicesList implements AfterViewChecked {
  readonly store = inject(DevicesStore);
  protected router = inject(Router);
  accountId: string = '';

  /**
   * Columns to be displayed in the table.
   */
  displayedColumns: string[] = ['macAddress', 'assignedSupply', 'network', 'deviceHealth', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /**
   * Computed property that returns a MatTableDataSource instance for the devices list.
   */
  dataSource = computed(() => {
    this.store.loadDevicesForAccount(this.accountId);
    const source = new MatTableDataSource(this.store.devices());
    source.sort = this.sort;
    source.paginator = this.paginator;
    return source;
  });

  /**
   * Lifecycle hook that is called after Angular has fully initialized the component's view.
   */
  ngAfterViewChecked() {
    if (this.dataSource().paginator !== this.paginator) {
      this.dataSource().paginator = this.paginator;
    }
    if (this.dataSource().sort !== this.sort) {
      this.dataSource().sort = this.sort;
    }
  }

  // Placeholder for filter button action
  openFilters(): void {
    // TODO: implement filter dialog/opening
    return;
  }

  // Placeholder for export button action
  exportTable(): void {
    // TODO: implement table export (CSV/XLSX)
    return;
  }

  // Placeholder for register device action
  public registerDevice = (): void => {
    // TODO: navigate to register device form or open dialog
    return;
  };
}
