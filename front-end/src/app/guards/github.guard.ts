import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable()
export class GitHubGuard implements CanLoad {
    constructor(private userService: UserService) {}

    canLoad() {
        return this.userService.isLoggedIn();
    }
}
