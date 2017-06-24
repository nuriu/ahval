import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import * as UIkit from 'uikit';

import { UserService } from '../../services/user.service';

@Component({
    selector   : 'login',
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
        if (this.loginForm.value.username && this.loginForm.value.password) {
            this.userService.login(this.loginForm.value.username, this.loginForm.value.password)
            .subscribe((res) => {
                if (res == "success") {
                    UIkit.notification('<span uk-icon="icon: check"></span> Hoşgeldiniz!', {
                        status: 'success',
                        pos   : 'bottom-right'
                    });
                    this.router.navigate(['home']);
                } else {
                    UIkit.notification('Giriş işlemi başarısız sonuçlandı. Lütfen tekrar deneyiniz.', {
                        status: 'danger',
                        pos   : 'bottom-right'
                    });
                }
            });
        } else {
            if (!this.loginForm.value.username) {
                UIkit.notification('Kullanıcı adı alanı boş bırakılamaz!', {
                    status: 'danger',
                    pos   : 'bottom-right'
                });
            }
            if (!this.loginForm.value.password) {
                UIkit.notification('Parola alanı boş bırakılamaz!', {
                    status: 'danger',
                    pos   : 'bottom-right'
                });
            }
        }
    }
}
