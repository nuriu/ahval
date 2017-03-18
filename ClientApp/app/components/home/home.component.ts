import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
    selector   : 'home',
    templateUrl: './home.component.html',
    styleUrls  : ['./home.component.css']
})
export class HomeComponent implements OnInit {
    isSignedIn: Boolean;
    loginForm : FormGroup;
    username  = new FormControl('', Validators.required);
    password  = new FormControl('', Validators.required);

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
        this.isSignedIn = false;
        this.loginForm  = this.formBuilder.group({
            username: this.username,
            password: this.password
        });
    }

    login() {
        console.log("Login request with;");
        console.log(this.loginForm.value);
    }
}
