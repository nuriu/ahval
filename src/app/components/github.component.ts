import { Component, Input, OnInit } from "@angular/core";

import { GitHubService } from "../services/github.service";

import { IAvatarComponentItem } from "../types/IAvatarComponentItem";

/**
 * Class for github component.
 */
@Component({
    selector: "github",
    templateUrl: "./github.component.html"
})
export class GitHubComponent implements OnInit {
    /**
     * Active github user.
     */
    @Input() user;
    /**
     * Repos of active github user.
     */
    @Input() repos;
    /**
     *
     */
    @Input() receivedEvents = new Array<any>();

    constructor(private _githubService: GitHubService) { }

    /**
     * Activate all things.
     */
    ngOnInit() {
        this.getActiveUser();
    }

    /**
     * Get active github user.
     */
    getActiveUser() {
        this._githubService.getUser().subscribe(
            data => this.user = data,
            error => console.log(error),
            () => {
                console.log(this.user);
                this.getActiveUsersRepos();
            }
        );
    }

    /**
     * Get all repos that active user involved.
     */
    getActiveUsersRepos() {
        this._githubService.getUserRepos("pushed", "desc").subscribe(
            data => this.repos = data,
            error => console.log(error),
            () => {
                console.log(this.repos);
                this.getStreamForActiveUser();
            }
        );
    }

    /**
     * Get stream for active user.
     */
    getStreamForActiveUser() {
        for (var i = 1; i <= 10; i++) {
            this._githubService.getUserReceivedEvents(this.user.login, i).subscribe(
                data => this.receivedEvents = this.receivedEvents.concat(data),
                error => console.log(error),
                () => {
                    console.log(this.receivedEvents);
                }
            );
        }
    }
}
