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
    @Input() orgMembers     = new Array<any>();
    @Input() repos          = new Array<any>();
    @Input() orgs           = new Array<any>();
    @Input() receivedEvents = new Array<any>();
    @Input() followingUsers = new Array<any>();
    @Input() followers      = new Array<any>();

    constructor(private githubService: GitHubService,
                private userService  : UserService,
                private route        : ActivatedRoute) { }

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

                if (this.user.blog !== '' && this.user.blog != null) {
                    const pattern = /^((http|https):\/\/)/;

                    if (!pattern.test(this.user.blog)) {
                        this.user.blog = 'http://' + this.user.blog;
                    }
                }

                if (this.user.type === 'Organization') {
                    this.getOrganizationMembers(this.user.login);
                }

                this.getUsersRepos();
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

    getOrganizationMembers(name: string) {
        this.githubService.getOrgMembers(name).subscribe(
            data => this.orgMembers = data,
            error => console.log(error),
            () => {
                console.log(this.orgMembers);
            }
        );
    }

    getUsersRepos() {
        for (let i = 1; i < 30; i++) {
            this.githubService.getUserRepos(this.user.login, 'updated', 'desc', i).subscribe(
                data => {
                    if (data.length < 1) {
                        return;
                    }

                    this.repos = this.repos.concat(data);
                },
                error => console.log(error)
            );
        }

        this.getFollowingUsers();
    }

    getFollowingUsers() {
        for (let i = 1; i < 30; i++) {
            this.githubService.getFollowingUsers(this.user.login, i).subscribe(
                data => {
                    if (data.length < 1) {
                        return;
                    }

                    this.followingUsers = this.followingUsers.concat(data);
                },
                error => console.log(error)
            );
        }

        this.getFollowers();
    }

    getFollowers() {
        for (let i = 1; i < 30; i++) {
            this.githubService.getFollowers(this.user.login, i).subscribe(
                data => {
                    if (data.length < 1) {
                        return;
                    }

                    this.followers = this.followers.concat(data);
                },
                error => console.log(error)
            );
        }

        this.getOrgs();
    }

    getOrgs() {
        this.githubService.getUserOrgs(this.user.login).subscribe(
            data  => this.orgs = data,
            error => console.log(error),
            ()    => {
                // console.log(this.orgs);
            }
        );
    }
}
