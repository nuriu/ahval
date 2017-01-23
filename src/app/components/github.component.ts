import { Component } from "@angular/core";

import { GitHubService } from "../services/github.service";

import { IAvatarComponentItem } from "../types/IAvatarComponentItem";

/**
 * Class for github component.
 */
@Component({
    selector: "github",
    templateUrl: "./github.component.html"
})
export class GitHubComponent {
    user: any;

    constructor(private _githubService: GitHubService) {

    }

    ngOnInit() {
        this.user = this._githubService.getUser();
    }
}
