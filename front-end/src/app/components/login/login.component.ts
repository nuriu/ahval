import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import * as toastr from 'toastr';

import { UserService } from '../../services/user.service';

@Component({
    selector   : 'login',
    templateUrl: './login.component.html',
    styleUrls  : ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm  : FormGroup;
    username   = new FormControl('', Validators.required);
    password   = new FormControl('', Validators.required);

    constructor(private formBuilder: FormBuilder,
                private userService: UserService,
                private router: Router) {}

    ngOnInit() {
        this.loginForm  = this.formBuilder.group({
            username: this.username,
            password: this.password
        });
    }

    onSubmit() {
        // TODO: DELETE LOG CODE
        console.log("Login request with; ");
        console.log(this.loginForm.value);

        this.userService.login(this.loginForm.value.username,
                               this.loginForm.value.password).subscribe((res) => {
                                    if (res == "success") {
                                        toastr.success('Sisteme başarıyla giriş yaptınız. Hoşgeldiniz!');
                                        this.router.navigate(['home']);
                                    } else {
                                        toastr.error('Giriş işlemi başarısız sonuçlandı. Lütfen tekrar deneyiniz.', 'Başarısız Giriş Denemesi');
                                    }
                               });
    }
}
