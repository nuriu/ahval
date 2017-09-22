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
    @Input() orgs;
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

                    this.getUser(params.login);
                } else {
                    console.log('Error: Could not get github access token of user.');
                }
            });
        });
    }

    getUser(login?: string) {
        if (login != null) {
            this.githubService.getUserInfo(login).subscribe((data) => {
                this.user = data;
                console.log(this.user);
            });
        } else {
            this.githubService.getUser().subscribe(
                data  => this.user = data,
                error => console.log(error),
                ()    => {
                    this.getUsersRepos();
                }
            );
        }
    }

    getUsersRepos() {
        this.githubService.getUserRepos(this.user.login, 'updated', 'desc').subscribe(
            data  => this.repos = data,
            error => console.log(error),
            ()    => {
                console.log(this.repos);
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
                this.getOrgs();
            }
        );
    }

    getOrgs() {
        this.githubService.getUserOrgs(this.user.login).subscribe(
            data  => this.orgs = data,
            error => console.log(error),
            ()    => {
                console.log(this.orgs);
            }
        );
    }
}
