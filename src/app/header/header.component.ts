import { Component, OnInit } from '@angular/core';
import { MatDialogConfig } from "@angular/material/dialog";
import { EmployeeComponent } from '../employees/employee/employee.component';
import { MatDialog } from "@angular/material/dialog";
import { EmployeeService } from '../service/employee.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private service: EmployeeService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onCreate() {
    this.service.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(EmployeeComponent,dialogConfig);
  }

}
