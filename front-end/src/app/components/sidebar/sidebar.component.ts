import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';

@Component({
    selector   : 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls  : ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    items: Array<string> = new Array<string>();

    constructor(private userService: UserService) { }

    ngOnInit() {
        if (this.userService.isLoggedIn()) {
            this.userService.getComponentList().subscribe(c => {
                c['userComponents'].forEach(element => {
                    this.items.push(element.component);
                });
            });
        }
    }

    signout() {
        this.userService.logout();
    }
}
