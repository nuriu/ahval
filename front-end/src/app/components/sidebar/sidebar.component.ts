import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';

@Component({
    selector   : 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls  : ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

    constructor(private userService: UserService) { }

    ngOnInit() {
        if (this.userService.isLoggedIn()) {
            this.userService.getComponentList().subscribe((res) => {
                console.log(res);
            });
        }
    }

    signout() {
        this.userService.logout();
    }
}
