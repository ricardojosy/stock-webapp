import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MenubarModule } from 'primeng/menubar';
import { MenuItem, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';

import { Category } from '../../types/Category';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MenubarModule,
    MessagesModule,
    ToastModule,
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    DropdownModule,
    DividerModule,
  ],
  providers: [MessageService],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {

  visible: boolean = false;
 
  categories: Category[] | undefined;
  items: MenuItem[] | undefined;

  constructor(
    private messageService: MessageService,
    private router: Router,
    ) { }

  ngOnInit() {
    this.items = [
      {label: 'Logout', icon: 'pi pi-sign-out', command: () => this.cleanSession()},
      {label: 'Products', icon: 'pi pi-barcode', command: () => this.router.navigate(["home"])},
      {label: 'Users', icon: 'pi pi-users', command: () => this.router.navigate(["users"])},
    ]
  }

  cleanSession() {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("expires");
    sessionStorage.removeItem("username");
    this.router.navigate(["login"]);
  }

  // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'New product registered', life: 3000 });

}