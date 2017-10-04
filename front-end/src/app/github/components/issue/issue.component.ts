import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../../services/user.service';
import { GitHubService } from '../../services/github.service';

@Component({
    selector: 'app-github-issue',
    templateUrl: 'issue.component.html',
    styleUrls: ['issue.component.css']
})
export class IssueComponent implements OnInit {
    @Input() repoName;
    @Input() issue;

    constructor(private githubService: GitHubService,
                private userService: UserService,
                private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.userService.getToken('GITHUB').subscribe((res) => {
                if (res.token) {
                    this.githubService.setToken(res.token);
                    this.githubService.activate();

                    if (params.owner != null && params.name != null && params.number != null) {
                        this.repoName = params.name;

                        this.githubService.getIssueInfo(params.owner, params.name, params.number)
                        .subscribe((data) => {
                            this.issue = data;

                            this.issue.created_at = new Date(this.issue.created_at);
                            this.issue.updated_at = new Date(this.issue.updated_at);

                            console.log(this.issue);

                            this.renderBody();
                        });
                    }
                } else {
                    console.log('Error: Could not get github access token of user.');
                }
            });
        });
    }

    renderBody() {
        this.githubService.getMarkdown(this.issue.body, this.issue.user.login + '/' + this.repoName)
        .subscribe((data) => {
            this.issue.body = data;
            console.log(this.issue.body);
        });
    }
}
