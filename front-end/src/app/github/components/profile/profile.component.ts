import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../../services/user.service';
import { GitHubService } from '../../services/github.service';

@Component({
    selector: 'app-github-profile',
    templateUrl: './profile.component.html',
    styleUrls  : ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    @Input() user;
    @Input() repos;
    @Input() receivedEvents = new Array<any>();
    @Input() followingUsers = new Array<any>();
    @Input() followers      = new Array<any>();

    constructor(private githubService: GitHubService,
                private userService: UserService,
                private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.userService.getToken('GITHUB').subscribe((res) => {
                if (res.token) {
                    this.githubService.setToken(res.token);
                    this.githubService.activate();

                    if (params.login != null) {
                        this.githubService.getUserInfo(params.login).subscribe((data) => {
                            this.user = data;
                        });
                    } else {
                        this.getActiveUser();
                    }
                } else {
                    console.log('Error: Could not get github access token of user.');
                }
            });
        });
    }

    getActiveUser() {
        this.githubService.getUser().subscribe(
            data  => this.user = data,
            error => console.log(error),
            ()    => {
                console.log(this.user);
                this.getActiveUsersRepos();
            }
        );
    }

    getActiveUsersRepos() {
        this.githubService.getUserRepos('pushed', 'desc').subscribe(
            data  => this.repos = data,
            error => console.log(error),
            ()    => {
                // console.log(this.repos);
                this.getFollowingUsers();
            }
        );
    }

    getFollowingUsers() {
        this.githubService.getFollowingUsers(this.user.login).subscribe(
            data  => this.followingUsers = data,
            error => console.log(error),
            ()    => {
                // console.log(this.followingUsers);
                this.getFollowers();
            }
        );
    }

    getFollowers() {
        this.githubService.getFollowers(this.user.login).subscribe(
            data  => this.followers = data,
            error => console.log(error),
            ()    => {
                // console.log(this.followers);
            }
        );
    }
}
