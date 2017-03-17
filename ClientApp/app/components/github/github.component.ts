import { Component, Input, OnInit } from '@angular/core';

import { GitHubService } from '../../services/github.service';

import { IAvatarComponentItem } from '../../types/IAvatarComponentItem';

@Component({
    selector   : 'github',
    templateUrl: './github.component.html',
    styleUrls  : ['./github.component.css']
})
export class GitHubComponent implements OnInit {
    @Input() user;
    @Input() repos;
    @Input() receivedEvents = new Array<any>();
    @Input() followingUsers = new Array<any>();
    @Input() followers      = new Array<any>();

    constructor(private _githubService: GitHubService) { }

    ngOnInit() {

    }

    getActiveUser() {
        this._githubService.getUser().subscribe(
            data  => this.user = data,
            error => console.log(error),
            ()    => {
                console.log(this.user);
                this.getActiveUsersRepos();
            }
        );
    }

    getActiveUsersRepos() {
        this._githubService.getUserRepos('pushed', 'desc').subscribe(
            data  => this.repos = data,
            error => console.log(error),
            ()    => {
                console.log(this.repos);
                this.getStreamForActiveUser();
            }
        );
    }

    getStreamForActiveUser() {
        for (var i = 1; i <= 1; i++) {
            this._githubService.getUserReceivedEvents(this.user.login, i).subscribe(
                data  => this.receivedEvents = this.receivedEvents.concat(data),
                error => console.log(error),
                ()    => {
                    console.log(this.receivedEvents);
                    this.getFollowingUsers();
                }
            );
        }
    }

    getFollowingUsers() {
        this._githubService.getFollowingUsers(this.user.login).subscribe(
            data  => this.followingUsers = data,
            error => console.log(error),
            ()    => {
                console.log(this.followingUsers);
                this.getFollowers();
            }
        );
    }

    getFollowers() {
        this._githubService.getFollowers(this.user.login).subscribe(
            data  => this.followers = data,
            error => console.log(error),
            ()    => {
                console.log(this.followers);
            }
        );
    }
}
