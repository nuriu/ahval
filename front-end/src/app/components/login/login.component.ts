import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';

import * as UIkit from 'uikit';



@Component({
    selector   : 'app-login',
    templateUrl: './login.component.html',
    styleUrls  : ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    username = new FormControl('', Validators.required);
    password = new FormControl('', Validators.required);

    constructor(private formBuilder: FormBuilder,
                private userService: UserService,
                private router     : Router) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: this.username,
            password: this.password
        });
    }

    onSubmit() {
        if (this.loginForm.value.username.trim() && this.loginForm.value.password.trim()) {
            this.userService.login(this.loginForm.value.username, this.loginForm.value.password)
            .subscribe((res) => {
                if (res) {
                    UIkit.notification('<span uk-icon="icon: check"></span> Hoşgeldiniz!', {
                        status: 'success',
                        pos   : 'top-center'
                    });
                    this.router.navigate(['home']);
                }
            }, (err) => {
                if (err.status = 400) {
                    UIkit.notification('Giriş işlemi başarısız sonuçlandı. Lütfen tekrar deneyiniz.', {
                        status: 'danger',
                        pos   : 'top-center'
                    });
                }
            });
        } else {
            if (!this.loginForm.value.username) {
                UIkit.notification('Kullanıcı adı alanı boş bırakılamaz!', {
                    status: 'danger',
                    pos   : 'top-center'
                });
            }
            if (!this.loginForm.value.password) {
                UIkit.notification('Parola alanı boş bırakılamaz!', {
                    status: 'danger',
                    pos   : 'top-center'
                });
            }
        }
    }
}
