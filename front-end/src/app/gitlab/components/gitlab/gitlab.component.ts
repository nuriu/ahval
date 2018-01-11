import { Component, Input, OnInit } from '@angular/core';

import { UserService } from '../../../services/user.service';
import { GitLabService } from '../../services/gitlab.service';



@Component({
    selector   : 'app-gitlab',
    templateUrl: './gitlab.component.html',
    styleUrls  : ['./gitlab.component.css']
})
export class GitLabComponent implements OnInit {
    @Input() user;
    @Input() repos;
    @Input() groups;
    @Input() receivedEvents;

    constructor(private gitlabService: GitLabService,
                private userService: UserService) { }

    ngOnInit() {
        this.userService.getToken('GITLAB').subscribe(res => {
            if (res['token']) {
                this.gitlabService.setToken(res['token']);
                this.getActiveUser();
            } else {
                console.log('Error: Could not get gitlab access token of user.');
            }
        });
    }

    getActiveUser() {
        this.gitlabService.getUser().subscribe(
            data  => this.user = data,
            error => console.log(error),
            ()    => {
                // console.log(this.user);
                this.getActiveUsersRepos();
            }
        );
    }

    getActiveUsersRepos() {
        this.gitlabService.getRepos().subscribe(
            data  => this.repos = data,
            error => console.log(error),
            ()    => {
                // console.log(this.repos);
                this.getActiveUsersEvents();
            }
        );
    }

    getActiveUsersEvents() {
        this.gitlabService.getEvents().subscribe(
            data  => this.receivedEvents = data,
            error => console.log(error),
            ()    => {
                console.log(this.receivedEvents);
                this.receivedEvents.forEach(element => {
                    element['created_at'] = new Date(element['created_at']);
                });
                this.getActiveUsersGroups();
            }
        );
    }

    getActiveUsersGroups() {
        this.gitlabService.getGroups().subscribe(
            data  => this.groups = data,
            error => console.log(error),
            ()    => {
                // console.log(this.groups);
            }
        )
    }
}
