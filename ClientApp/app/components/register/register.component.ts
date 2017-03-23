import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';

@Component({
    selector   : 'register',
    templateUrl: './register.component.html',
    styleUrls  : ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    registerForm  : FormGroup;
    username   = new FormControl('', Validators.required);
    password   = new FormControl('', Validators.required);

    constructor(private formBuilder: FormBuilder,
                private userService: UserService,
                private router: Router) {}

    ngOnInit() {
        this.registerForm  = this.formBuilder.group({
            username: this.username,
            password: this.password
        });
    }

    onSubmit() {
        // TODO: DELETE LOG CODE
        console.log("Register request with; ");
        console.log(this.registerForm.value);

        this.userService.register(this.registerForm.value.username,
                                  this.registerForm.value.password).subscribe((res) => {
                                      if (res == "success") {
                                          this.router.navigate(['login']);
                                          // TODO: Show success toast.
                                      } else {
                                          // TODO: Show register error toast.
                                      }
                               });
    }
}
