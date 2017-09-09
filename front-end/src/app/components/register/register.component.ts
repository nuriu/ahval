import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import * as UIkit from 'uikit';

import { UserService } from '../../services/user.service';

@Component({
    selector   : 'register',
    templateUrl: './register.component.html',
    styleUrls  : ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    username = new FormControl('', Validators.required);
    password = new FormControl('', Validators.required);

    constructor(private formBuilder: FormBuilder,
                private userService: UserService,
                private router     : Router) { }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            username: this.username,
            password: this.password
        });
    }

    onSubmit() {
        if (this.registerForm.value.username.trim() && this.registerForm.value.password.trim()) {
            this.userService.register(this.registerForm.value.username, this.registerForm.value.password)
            .subscribe((res) => {
                if (res) {
                    UIkit.notification('<span uk-icon="icon: check"></span> Kayıt işlemi başarılı sonuçlandı!', {
                        status: 'success',
                        pos   : 'bottom-right'
                    });
                    this.router.navigate(['login']);
                } else {
                    if (res.message === 'Registration failed. User with same username exists.') {
                        UIkit.notification('Sistemde aynı kullanıcı ismine sahip bir kullanıcı mevcut.<br/>\
                        <br/>Lütfen farklı bir kullanıcı ismiyle tekrar deneyiniz.', {
                            status: 'danger',
                            pos   : 'bottom-right'
                        });
                    } else {
                        UIkit.notification('Kayıt işlemi başarısız sonuçlandı. Lütfen tekrar deneyiniz.', {
                            status: 'danger',
                            pos   : 'bottom-right'
                        });
                    }

                }
            });
        } else {
            if (!this.registerForm.value.username) {
                UIkit.notification('Kullanıcı adı alanı boş bırakılamaz!', {
                    status: 'danger',
                    pos: 'bottom-right'
                });
            }
            if (!this.registerForm.value.password) {
                UIkit.notification('Parola alanı boş bırakılamaz!', {
                    status: 'danger',
                    pos: 'bottom-right'
                });
            }
        }
    }
}
