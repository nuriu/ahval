import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { isBrowser } from 'angular2-universal';

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
        /*
        if (isBrowser) {
            if (!!localStorage.getItem('ajanda_auth_token')) {
                this.router.navigate(['home']);
            }
        }
        */
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
                                       this.router.navigate(['home']);
                                    } else {
                                        // TODO: Show login error toast.
                                    }
                               });
    }
}
