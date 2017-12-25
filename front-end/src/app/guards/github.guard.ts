import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs/Rx';



@Injectable()
export class GitHubGuard implements CanLoad {
    constructor(private userService: UserService) { }

    canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
        return !!this.userService.hasComponent('GITHUB');
    }
}
