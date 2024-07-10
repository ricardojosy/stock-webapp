import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DividerModule } from 'primeng/divider';

import { MenuComponent } from '../../components/menu/menu.component';
import { UserService } from '../../services/user.service';
import { User } from '../../types/User';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MenuComponent,
    TableModule,
    CommonModule,
    ScrollPanelModule,
    ToastModule,
    FormsModule,
    CheckboxModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    ReactiveFormsModule,
    InputSwitchModule,
    DividerModule,
  ],
  providers: [
    UserService,
    MessageService,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  protected form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl(''),
  });

  users: User[] = [];
  username: any | undefined;

  selectedUser: User | undefined;
  protected msg: string = '';
  protected hdrMsg: string = '';

  page = 0;
  size = 20;
  rows = 5;

  constructor(
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.username = sessionStorage.getItem("username");
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe({
      next: (data: any) => {
        this.users = data;
        console.log(JSON.stringify(this.users, null, 2));
      },
      error: (e) => {
        if (e.status == '401') {
          this.msg = 'Unauthorized. Verify yours credentials.';
          this.hdrMsg = 'Error';
          this.showMsg();
        }
        if (e.status == '403') {
          this.msg = 'You are not allowed!';
          this.hdrMsg = 'Error';
          this.showMsg();
        }
        if (e.status == '500') {
          this.msg = 'Internal error, please notify the suport!';
          this.hdrMsg = 'Error';
          this.showMsg();
        }
        setTimeout(() => { this.router.navigate(["login"]) }, 15000);
      }
    });

  }

  onRowSelect(event: any) {
    this.form.setValue({
      username: this.selectedUser?.username,
      password: this.selectedUser?.password,
    });
    console.log(JSON.stringify(this.selectedUser, null, 2));
  }

  onRowUnselect(event: any) {
    this.selectedUser = undefined;
    this.form.reset();
  }

  addUser() {
    const user = this.form.value as User;
    user.password = '123';
    this.userService.addUser(user).subscribe({
      next: (data: any) => {
        this.onRowUnselect(null);
        this.getUsers();
        this.msg = 'User added with success!';
        this.hdrMsg = 'Success';
        this.showMsg();
        setTimeout(() => { this.router.navigate(["users"]) }, 1500);
      },
      error: (e) => {
        this.credentialsErrorMsg(e);
        this.notAllowedMsg(e);
        this.unprocErrorMsg(e);
        this.insternalErrorMsg(e);
        // setTimeout(() => { this.router.navigate(["login"]) }, 1500);
      }
    });
  }

  updateUser() {
    const user = this.form.value as User;
    if (user.username == 'admin') {
      this.onRowUnselect(null);
      this.msg = 'User admin can not be updated!';
      this.hdrMsg = 'Warning';
      this.showMsg();
      return;
    }
    user.id = this.selectedUser?.id;
    this.userService.updateUser(user).subscribe({
      next: (data: any) => {
        this.onRowUnselect(null);
        this.getUsers();
        this.msg = 'User updated with success!';
        this.hdrMsg = 'Success';
        this.showMsg();
        setTimeout(() => { this.router.navigate(["users"]) }, 1000);
      },
      error: (e) => {
        this.credentialsErrorMsg(e);
        this.notAllowedMsg(e);
        this.unprocErrorMsg(e);
        this.insternalErrorMsg(e);
        // setTimeout(() => { this.router.navigate(["login"]) }, 1500);
      }
    });
  }

  deleteUser() {
    const id: string = this.selectedUser?.id!;
    const user = this.form.value as User;
    if (user.username == 'admin') {
      this.onRowUnselect(null);
      this.msg = 'User admin can not be deleted!';
      this.hdrMsg = 'Warning';
      this.showMsg();
      return;
    }
    this.userService.deleteUser(id).subscribe({
      next: (data: any) => {
        this.onRowUnselect(null);
        this.getUsers();
        this.msg = 'User deleted with success!';
        this.hdrMsg = 'Success';
        this.showMsg();
        setTimeout(() => { this.router.navigate(["users"]) }, 1000);
      },
      error: (e) => {
        this.credentialsErrorMsg(e);
        this.notAllowedMsg(e);
        this.insternalErrorMsg(e);
        // setTimeout(() => { this.router.navigate(["login"]) }, 1500);
      }
    });
  }

  credentialsErrorMsg(e: any) {
    if (e.status == '401') {
      this.msg = 'Unauthorized. Verify yours credentials.';
      this.hdrMsg = 'Error';
      this.showMsg();
    }
  }

  notAllowedMsg(e: any) {
    if (e.status == '403') {
      this.msg = 'You are not allowed!';
      this.hdrMsg = 'Error';
      this.showMsg();
    }
  }

  insternalErrorMsg(e: any) {
    if (e.status == '500') {
      this.msg = 'Internal error, please notify the suport!';
      this.hdrMsg = 'Error';
      this.showMsg();
    }
  }

  unprocErrorMsg(e: any) {
    if (e.status == '422') {
      this.msg = 'Username already registered!';
      this.hdrMsg = 'Error';
      this.showMsg();
    }
  }

  showMsg() {
    let sev: string = '';
    if (this.hdrMsg == 'Success') { sev = 'success'; }
    if (this.hdrMsg == 'Warning') { sev = 'warn'; }
    if (this.hdrMsg == 'Error') { sev = 'error'; }
    this.messageService.add({ key: 'msgs', sticky: false, severity: sev, summary: this.msg, life: 1500 });
  }

  showConfirm() {
    this.messageService.add({ key: 'confirm', sticky: true, severity: 'warn', summary: 'Are you sure?' });
  }

  onConfirm() {
    this.messageService.clear('confirm');
    this.deleteUser();
  }

  onReject() {
    this.messageService.clear('confirm');
  }
}
