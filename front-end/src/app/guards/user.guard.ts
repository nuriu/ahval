import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable()
export class UserGuard implements CanActivate {
    constructor(private userService: UserService) {}

    canActivate() {
        return this.userService.isLoggedIn();
    }
}
