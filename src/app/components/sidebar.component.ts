import { Component, OnInit } from "@angular/core";

import { GitHubService } from "../services/github.service";

import { IMenuItem } from "../types/IMenuItem";

/**
 * Class for sidebar component.
 */
@Component({
    selector: "sidebar",
    templateUrl: "./sidebar.component.html"
})

export class SidebarComponent implements OnInit {
    /**
     * Active menu item.
     */
    activeItem: IMenuItem = null;

    /**
     * Sidebar menu items.
     */
    items: IMenuItem[] = [
        { name: "GitHub", iconClass: "big github icon", avatarLink: null, routerLink: "/github" },
        { name: "GitLab", iconClass: "big orange gitlab icon", avatarLink: null, routerLink: "/gitlab" },
        { name: "BitBucket", iconClass: "big blue bitbucket icon", avatarLink: null, routerLink: "/bitbucket" },
        { name: "Trello", iconClass: "big teal trello icon", avatarLink: null, routerLink: "/trello" }
    ];

    constructor(private _githubService: GitHubService) { }

    ngOnInit() {

    }

    /**
     * Activates selected menu item.
     * @param {string} selectedItem The selected menu item.
     */
    select(selectedItem: string) {
        console.log(selectedItem + " seçildi.");

        switch (selectedItem) {
            case this.items[0].name:
                this._githubService.getUserAvatarLink().subscribe(
                    data => this.items[0].avatarLink = data,
                    error => console.log(error)
                );
                this.activeItem = this.items[0];
                break;

            case this.items[1].name:
                this.activeItem = this.items[1];
                break;

            case this.items[2].name:
                this.activeItem = this.items[2];
                break;

            case this.items[3].name:
                this.activeItem = this.items[3];
                break;
            default:
                break;
        }

        $("#menu>.item").removeClass("active");
        $("#menu>#" + this.activeItem.name).addClass("active");
    }
}
