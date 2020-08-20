import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../service/employee.service';
import { EmployeeComponent } from '../employees/employee/employee.component';

import { DepartmentService } from '../service/department.service';
import { NotificationService } from '../service/notification.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {  MatSort } from '@angular/material/sort';
import { MatDialog } from "@angular/material/dialog";
import { MatDialogConfig } from "@angular/material/dialog";


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  constructor(private service: EmployeeService,
    private departmentService: DepartmentService,
    private dialog: MatDialog,
    private notificationService: NotificationService) { }

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['fullName', 'email', 'mobile', 'city', 'departmentName', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  ngOnInit() {
    this.service.getEmployees().subscribe(
      list => {
        let array = list.map(item => {
          let departmentName = this.departmentService.getDepartmentName(item.payload.val()['department']);
          return {
            $key: item.key,
            departmentName,
            ...item.payload.val()
          };
        });
        this.listData = new MatTableDataSource(array);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
        this.listData.filterPredicate = (data, filter) => {
          return this.displayedColumns.some(ele => {
            return ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
          });
        };
      });
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }


  onCreate() {
    this.service.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(EmployeeComponent,dialogConfig);
  }

  onEdit(row){
    this.service.populateForm(row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(EmployeeComponent,dialogConfig);
  }

  onDelete($key){
    if(confirm('Are you sure to delete this record ?')){
    this.service.deleteEmployee($key);
    this.notificationService.warn('! Deleted successfully');
    }
  }

}
