import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import 'rxjs/Rx';

/**
 * Services that provides github api calls.
 */
@Injectable()
export class GitHubService {

    /**
     * Auth string.
     */
    h: Headers;

    constructor(private _http: Http) { }

    /**
     * Activates this service.
     */
    activate(username: string) {
        this.h = new Headers();
        /*
        this._http.get('/githubToken/' + username, {}).subscribe(
            data => console.log(data),
            error => console.log(error),
            () => {
                console.log('deneme');
            }
        );
        */
        //this.h.set('Authorization:', 'token ' + token);
    }

    /**
     * Get github user info.
     */
    getUser() {
        return this._http.get('https://api.github.com/user', {
            headers: this.h
        }).map(res => res.json());
    }

    /**
     * Get active users avatar url.
     */
    getUserAvatarLink() {
        return this._http.get('https://api.github.com/user', {
            headers: this.h
        }).map(res => res.json().avatar_url);
    }

    /**
     * Get repos of active github user.
     */
    getUserRepos(sort: string, direction: string) {
        let p = new URLSearchParams();
        p.set('sort', sort);
        p.set('direction', direction);
        return this._http.get('https://api.github.com/user/repos', {
            headers: this.h,
            search : p
        }).map(res => res.json());
    }

    /**
     * Get stream of active github user.
     */
    getUserReceivedEvents(login: string, page: number) {
        return this._http.get('https://api.github.com/users/' + login + '/received_events?page=' + page, {
            headers: this.h
        }).map(res => res.json());
    }

    /**
     * Get list who a user is following.
     */
    getFollowingUsers(login: string) {
        return this._http.get('https://api.github.com/users/' + login + '/following', {
            headers: this.h
        }).map(res => res.json());
    }

    /**
     * Get list of a user's followers.
     */
    getFollowers(login: string) {
        return this._http.get('https://api.github.com/users/' + login + '/followers', {
            headers: this.h
        }).map(res => res.json());
    }
}
