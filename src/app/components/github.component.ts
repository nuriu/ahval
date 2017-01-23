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

    constructor(private _githubService: GitHubService) {

    }

    ngOnInit() {
        this.getActiveUser();
    }

    getActiveUser() {
        this._githubService.getUser().subscribe(
            data => this.user = data,
            error => console.log(error)
        );
    }
}
