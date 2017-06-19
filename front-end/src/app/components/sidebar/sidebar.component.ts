import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { GitHubService } from '../../services/github.service';

import { IMenuItem } from '../../types/IMenuItem';

@Component({
    selector   : 'sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls  : ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {
    isLoggedIn: Boolean     = false;
    activeItem: IMenuItem   = null;

    items: IMenuItem[] = [
        { name: 'GitHub', iconClass : 'big github icon', avatarLink : null, routerLink: '/github' },
    ];

    userSpesificItems: IMenuItem[] = [
        { name: 'Profile', iconClass : 'big olive user icon', avatarLink : null, routerLink: '/profile' }
    ];

    constructor(private userService  : UserService,
                private githubService: GitHubService) { }

    ngOnInit() {
        this.isLoggedIn = this.userService.isLoggedIn();
    }

    select(selectedItem: string) {
        console.log(selectedItem + ' seçildi.');

        switch (selectedItem) {
            case this.items[0].name:
                // this.githubService.activate();
                // this.githubService.getUserAvatarLink().subscribe(
                //     data  => this.items[0].avatarLink = data,
                //     error => console.log(error)
                // );
                this.activeItem = this.items[0];
                break;

            case this.userSpesificItems[0].name:
                this.activeItem = this.userSpesificItems[0];
                break;

            default:
                break;
        }
    }
}
