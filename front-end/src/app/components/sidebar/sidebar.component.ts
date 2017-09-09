import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';

@Component({
    selector   : 'sidebar',
    selector   : 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls  : ['./sidebar.component.css']
})

export class SidebarComponent {
    constructor(private userService  : UserService) { }

    signout() {
        console.log(this.userService.isLoggedIn());
        this.userService.logout();
    }
}
