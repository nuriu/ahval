import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../../services/user.service';
import { GitHubService } from '../../services/github.service';
import { WeeklyService } from '../../../weekly/services/weekly.service';

import * as $ from 'jquery';
import * as UIkit from 'uikit';



@Component({
    selector: 'app-github-issue',
    templateUrl: 'issue.component.html',
    styleUrls: ['issue.component.css']
})
export class IssueComponent implements OnInit {
    @Input() user;
    @Input() repoOwner;
    @Input() repoName;
    @Input() issue;
    @Input() events;
    @Input() comments;

    constructor(private githubService: GitHubService,
                private userService: UserService,
                private weeklyService: WeeklyService,
                private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.userService.getToken('GITHUB').subscribe(res => {
                if (res['token']) {
                    this.githubService.setToken(res['token']);

                    if (params.owner != null && params.name != null && params.number != null) {
                        this.repoName = params.name;

                        this.githubService.getIssueInfo(params.owner, params.name, params.number)
                        .subscribe((data) => {
                            this.issue = data;

                            this.issue.created_at = new Date(this.issue.created_at);
                            this.issue.updated_at = new Date(this.issue.updated_at);

                            // console.log(this.issue);

                            this.getUserInfo();
                            this.getOwnerInfo(params.owner);
                        });
                    }
                } else {
                    console.log('Error: Could not get github access token of user.');
                }
            });
        });
    }

    getUserInfo() {
        this.githubService.getUser().subscribe(data => {
            this.user = data;
        });
    }

    getOwnerInfo(login: string) {
        this.githubService.getUserInfo(login).subscribe(data => {
            this.repoOwner = data;

            this.getEvents();
            this.getComments();
        });
    }

    getEvents() {
        this.githubService.getIssueEvents(this.repoOwner.login, this.repoName, this.issue.number)
        .subscribe(data => {
            this.events = data;
            this.events.forEach(event => {
                event.created_at = new Date(event.created_at);
            });
            // console.log(this.events);
        });
    }

    getComments() {
        this.githubService.getIssueComments(this.repoOwner.login, this.repoName, this.issue.number)
        .subscribe(data => {
            this.comments = data;
            this.comments.forEach(comment => {
                comment.created_at = new Date(comment.created_at);
                comment.updated_at = new Date(comment.updated_at);
            });
            // console.log(this.comments);
        });
    }

    addComment() {
        if ($('#commentForm>textarea').val() != null &&
            $('#commentForm>textarea').val().toString().trim() !== '') {
            this.githubService.addIssueComment(this.repoOwner.login, this.repoName, this.issue.number,
                                               $('#commentForm>textarea').val().toString())
            .subscribe(res => {
                // console.log(res);
            });
        } else {
            UIkit.notification('Boş yorum eklenemez!', {
                status: 'danger',
                pos: 'top-center'
            });
        }
    }

    addIssueAsWeeklyItem() {
        if ($('#assignationDate').val() != null &&
            $('#assignationDate').val().toString().trim() !== '') {
            const date = new Date($('#assignationDate').val().toString());
            this.weeklyService.addIssue('GITHUB', this.repoOwner.login + '/' + this.repoName,
                                        this.issue.number, date)
            .subscribe(res => {
                if (res) {
                    // console.log(res);
                } else {
                    UIkit.notification('Bir hata oluştu!', {
                        status: 'danger',
                        pos: 'top-center'
                    });
                }
            });
        } else {
            UIkit.notification('Tarihi seçmediniz!', {
                status: 'danger',
                pos: 'top-center'
            });
        }
    }
}
