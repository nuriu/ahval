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
    @Input() activePage     = 1;

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
        this.githubService.getRepos().subscribe(
            data  => this.repos = data,
            error => console.log(error),
            ()    => {
                // console.log(this.repos);
                this.getStreamForActiveUser();
            }
        );
    }

    getStreamForActiveUser() {
        this.githubService.getUserReceivedEvents(this.user.login, this.activePage).subscribe(
            data  => this.receivedEvents = data,
            error => console.log(error),
            ()    => {
                // console.log(this.receivedEvents);
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
            }
        );
    }

    setPage(page: number) {
        if (this.activePage !== page) {
            this.highlightActivePageNumber(this.activePage, page);
            this.activePage = page;
            this.getStreamForActiveUser();
        }
    }

    nextPage() {
        if (this.activePage < 10) {
            this.highlightActivePageNumber(this.activePage, this.activePage + 1);
            this.activePage++;
            this.getStreamForActiveUser();
        }
    }

    previousPage() {
        if (this.activePage > 1) {
            this.highlightActivePageNumber(this.activePage, this.activePage - 1);
            this.activePage--;
            this.getStreamForActiveUser();
        }
    }

    highlightActivePageNumber(oldPage: number, newPage: number) {
        document.getElementsByName('paginationItem').item(oldPage - 1).className = '';
        document.getElementsByName('paginationItem').item(newPage - 1).className = 'uk-active';
    }
}
