import { Component, Input, OnInit, OnChanges, SimpleChanges } from "@angular/core";

import { GitHubService } from "../services/github.service";

import { IAvatarComponentItem } from "../types/IAvatarComponentItem";

/**
 * Class for github component.
 */
@Component({
    selector: "github",
    templateUrl: "./github.component.html"
})
export class GitHubComponent implements OnInit, OnChanges {
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
        this._githubService.getHttpUser().subscribe(
            data => this.user = data,
            error => console.log(error),
            () => console.log("Finished request.")
        );
        //this._githubService.getUser().then(u => this.user = u);
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes);
        console.log(JSON.stringify(changes));
    }
}
