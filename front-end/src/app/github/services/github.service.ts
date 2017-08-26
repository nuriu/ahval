import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Params } from '@angular/router';
import 'rxjs/Rx';


@Injectable()
export class GitHubService {
    private APIUrl = 'http://localhost:5000';
    private h    : Headers = new Headers();
    private token;
    /*
    client       : any;
    client_id    : string;
    client_secret: string;
    redirect_url : string;
    scopes       : any;
    */

    constructor(private http: Http) {}

    activate() {
        this.h.set('Authorization', 'token ' + this.token);

        console.log(this.h.get("Authorization"));
    }

    setToken(token: string) {
        this.token = token;
    }

    getUser() {
        return this.http.get('https://api.github.com/user', {
            headers: this.h
        }).map(res => res.json());
    }

    getUserAvatarLink() {
        return this.http.get('https://api.github.com/user', {
            headers: this.h
        }).map(res => res.json().avatar_url);
    }

    getUserRepos(sort: string, direction: string) {
        let p = new URLSearchParams();
        p.set('sort', sort);
        p.set('direction', direction);
        return this.http.get('https://api.github.com/user/repos', {
            headers: this.h,
            search : p
        }).map(res => res.json());
    }

    getUserReceivedEvents(login: string, page: number) {
        return this.http.get('https://api.github.com/users/' + login + '/received_events?page=' + page, {
            headers: this.h
        }).map(res => res.json());
    }

    getFollowingUsers(login: string) {
        return this.http.get('https://api.github.com/users/' + login + '/following', {
            headers: this.h
        }).map(res => res.json());
    }

    getFollowers(login: string) {
        return this.http.get('https://api.github.com/users/' + login + '/followers', {
            headers: this.h
        }).map(res => res.json());
    }
}