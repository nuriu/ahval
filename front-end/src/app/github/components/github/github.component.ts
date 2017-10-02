import { Component, Input, OnInit } from '@angular/core';

import { UserService } from '../../../services/user.service';
import { GitHubService } from '../../services/github.service';

@Component({
    selector   : 'app-github',
    templateUrl: './github.component.html',
    styleUrls  : ['./github.component.css']
})
export class GitHubComponent implements OnInit {
    @Input() user;
    @Input() repos;
    @Input() receivedEvents = new Array<any>();
    @Input() followingUsers = new Array<any>();

    constructor(private githubService: GitHubService,
                private userService: UserService) {}

    ngOnInit() {
        this.userService.getToken('GITHUB').subscribe((res) => {
            if (res.token) {
                this.githubService.setToken(res.token);
                this.githubService.activate();
                this.getActiveUser();
            } else {
                console.log('Error: Could not get github access token of user.');
            }
        });
    }

    getActiveUser() {
        this.githubService.getUser().subscribe(
            data  => this.user = data,
            error => console.log(error),
            ()    => {
                // console.log(this.user);
                this.getActiveUsersRepos();
            }
        );
    }

    getActiveUsersRepos() {
        this.githubService.getUserRepos(this.user.login, 'updated', 'desc').subscribe(
            data  => this.repos = data,
            error => console.log(error),
            ()    => {
                // console.log(this.repos);
                this.getStreamForActiveUser();
            }
        );
    }

    getStreamForActiveUser() {
        for (let i = 1; i <= 10; i++) {
            this.githubService.getUserReceivedEvents(this.user.login, i).subscribe(
                data  => this.receivedEvents = this.receivedEvents.concat(data),
                error => console.log(error),
                ()    => {
                    if (i === 10) {
                        // console.log(this.receivedEvents);
                        this.getFollowingUsers();
                    }
                }
            );
        }
    }

    getFollowingUsers() {
        this.githubService.getFollowingUsers(this.user.login).subscribe(
            data  => this.followingUsers = data,
            error => console.log(error),
            ()    => {
                // console.log(this.followingUsers);
            }
        );
    }
}
