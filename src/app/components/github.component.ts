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

    constructor(private _githubService: GitHubService) {}

    /**
     * Activate all things.
     */
    ngOnInit() {
        this.getActiveUser();
        this.getActiveUsersRepos();
    }

    /**
     * Get active github user.
     */
    getActiveUser() {
        this._githubService.getUser().subscribe(
            data => this.user = data,
            error => console.log(error)
        );
    }

    /**
     * Get all repos that active user involved.
     */
    getActiveUsersRepos() {
        this._githubService.getUserRepos("pushed", "desc").subscribe(
            data => this.repos = data,
            error => console.log(error)
        );
    }
}
