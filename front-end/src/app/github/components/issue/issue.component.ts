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
    @Input() repoOwner;
    @Input() repoName;
    @Input() issue;
    @Input() events;
    @Input() comments;

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
                        this.repoOwner = params.owner;

                        this.githubService.getIssueInfo(params.owner, params.name, params.number)
                        .subscribe((data) => {
                            this.issue = data;

                            this.issue.created_at = new Date(this.issue.created_at);
                            this.issue.updated_at = new Date(this.issue.updated_at);

                            // console.log(this.issue);

                            this.renderBody();
                            this.getEvents();
                            this.getComments();
                        });
                    }
                } else {
                    console.log('Error: Could not get github access token of user.');
                }
            });
        });
    }

    getEvents() {
        this.githubService.getIssueEvents(this.repoOwner, this.repoName, this.issue.number)
        .subscribe((data) => {
            this.events = data;
            console.log(this.events);
        });
    }

    getComments() {
        this.githubService.getIssueComments(this.repoOwner, this.repoName, this.issue.number)
        .subscribe((data) => {
            this.comments = data;
            console.log(this.comments);
        });
    }

    renderBody() {
        this.githubService.getMarkdown(this.issue.body, this.repoOwner + '/' + this.repoName)
        .subscribe((data) => {
            this.issue.body = data;
        });
    }
}
