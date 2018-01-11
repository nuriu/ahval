import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../../services/user.service';
import { GitLabService } from '../../services/gitlab.service';
import { WeeklyService } from '../../../weekly/services/weekly.service';

import * as $ from 'jquery';
import * as UIkit from 'uikit';
import * as moment from 'moment';



@Component({
    selector: 'app-gitlab-issue',
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

    constructor(private gitlabService: GitLabService,
                private userService: UserService,
                private weeklyService: WeeklyService,
                private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.userService.getToken('GITLAB').subscribe(res => {
                if (res['token']) {
                    this.gitlabService.setToken(res['token']);

                    if (params.owner != null && params.name != null && params.number != null) {
                        this.repoName = params.name;
                        this.repoOwner = params.owner;

                        this.gitlabService.getIssueInfo(params.owner, params.name, params.number)
                        .subscribe(data => {
                            this.issue = data;

                            this.issue.created_at = new Date(this.issue.created_at);
                            this.issue.updated_at = new Date(this.issue.updated_at);

                            // console.log(this.issue);

                            this.gitlabService.getUser().subscribe(u => this.user = u, error => console.log(error));
                            this.getEvents();
                        });
                    }
                } else {
                    console.log('Error: Could not get gitlab access token of user.');
                }
            });
        });

    }

    getEvents() {
        // this.gitlabService.getIssueEvents(this.repoOwner.login, this.repoName, this.issue.number)
        // .subscribe(data => {
        //     this.events = data;
        //     this.events.forEach(event => {
        //         event.created_at = new Date(event.created_at);
        //     });
        //     // console.log(this.events);
        // });
    }

    getComments() {
        // this.gitlabService.getIssueComments(this.repoOwner.username, this.repoName, this.issue.number)
        // .subscribe(data => {
        //     this.comments = data;
        //     this.comments.forEach(comment => {
        //         comment.created_at = new Date(comment.created_at);
        //         comment.updated_at = new Date(comment.updated_at);
        //     });
        //     // console.log(this.comments);
        // });
    }

    addComment() {
        if ($('#commentForm > div > textarea').val() != null &&
            $('#commentForm > div > textarea').val().toString().trim() !== '') {
            this.gitlabService.addIssueComment(this.repoOwner, this.repoName, this.issue.iid,
                                               $('#commentForm > div > textarea').val().toString())
            .subscribe(res => {
                console.log(res);
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
            const date = moment($('#assignationDate').val().toString());
            this.weeklyService.addIssue('GITLAB', this.repoOwner + '/' + this.repoName,
                                        this.issue.iid, date)
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
