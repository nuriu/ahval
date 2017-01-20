import { Component, NgZone } from "@angular/core";

import { GitHub } from "../github/github";

@Component({
    selector: "sidebar",
    templateUrl: "sidebar.component.html"
})

/**
 * Class for sidebar component.
 */
export class SidebarComponent {
    /**
     * Github client class.
     */
    github: GitHub;
    /**
     * Active menu item.
     */
    activeItem: any = null;

    /**
     * Sidebar menu items.
     */
    items: any[] = [
        { name: "GitHub", iconClass: "big github icon", avatarLink: null },
        { name: "GitLab", iconClass: "big orange gitlab icon", avatarLink: null },
        { name: "BitBucket", iconClass: "big blue bitbucket icon", avatarLink: null },
        { name: "Trello", iconClass: "big teal trello icon", avatarLink: null }
    ];

    /**
     * @brief      Activates selected menu item.
     *
     * @param      selectedItem  The selected menu item
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

        if (this.github.user) {
            this.items[0].avatarLink = this.github.user.avatar_url;
            this.items[0].uname = this.github.user.name;
            this.items[0].desc = this.github.user.bio;
        }

    }
}
