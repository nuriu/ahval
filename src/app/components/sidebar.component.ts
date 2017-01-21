import { Component } from "@angular/core";

import { GitHub } from "../github/github";
import { IMenuItem } from "../types/IMenuItem";

/**
 * Class for sidebar component.
 */
@Component({
    selector: "sidebar",
    templateUrl: "./sidebar.component.html"
})

export class SidebarComponent {

    /**
     * Github client instance.
     */
    github: GitHub;

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

    /**
     * Activates selected menu item.
     * @param {string} selectedItem The selected menu item.
     */
    select(selectedItem: string) {
        console.log(selectedItem + " seçildi.");
        switch (selectedItem) {
            case this.items[0].name:
                if (!this.github) this.github = GitHub.getInstance();

                if (this.activeItem) {
                    if (selectedItem != this.activeItem.name) {
                        this.activeItem = this.items[0];
                        this.github.activateGitHub();
                    }
                } else {
                    this.activeItem = this.items[0];
                    this.github.activateGitHub();
                }
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

        /*
        if (this.github.user) {
            this.items[0].avatarLink = this.github.user.avatar_url;
        }
        */

    }
}
