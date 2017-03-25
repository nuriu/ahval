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

    constructor(private githubService: GitHubService) { }

    ngOnInit() {
        this.githubService.activate();
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
                console.log(this.repos);
                this.getStreamForActiveUser();
            }
        );
    }

    getStreamForActiveUser() {
        for (var i = 1; i <= 1; i++) {
            this.githubService.getUserReceivedEvents(this.user.login, i).subscribe(
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
        this.githubService.getFollowingUsers(this.user.login).subscribe(
            data  => this.followingUsers = data,
            error => console.log(error),
            ()    => {
                console.log(this.followingUsers);
                this.getFollowers();
            }
        );
    }

    getFollowers() {
        this.githubService.getFollowers(this.user.login).subscribe(
            data  => this.followers = data,
            error => console.log(error),
            ()    => {
                console.log(this.followers);
            }
        );
    }
}
