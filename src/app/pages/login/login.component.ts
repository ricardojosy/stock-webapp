import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { LoginService } from '../../services/login.service';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';

interface LoginForm {
  username: FormControl,
  password: FormControl
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent,
    MessagesModule,
    ToastModule,
  ],
  providers: [
    LoginService,
    MessageService,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup<LoginForm>;

  protected msg: string = '';
  protected hdrMsg: string = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private messageService: MessageService,
  ){
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)])
    })
  }

  submit(){
    this.loginService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
      next: () => this.router.navigate(["home"]),
      error: (e) => {
        console.log(`ERRO: ${JSON.stringify(e, null, 2)}`);
        this.credentialsErrorMsg(e);
        this.notAllowedMsg(e);
        this.insternalErrorMsg(e);
        setTimeout(() => { this.router.navigate(["login"]) }, 1500);
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

  showMsg() {
    let sev: string = '';
    if (this.hdrMsg == 'Success') { sev = 'success'; }
    if (this.hdrMsg == 'Warning') { sev = 'warn'; }
    if (this.hdrMsg == 'Error') { sev = 'error'; }
    this.messageService.add({ key: 'msgs', sticky: false, severity: sev, summary: this.msg, life: 2000 });
  }

}
