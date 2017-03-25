import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class GitHubService {
    h            : Headers;
    client_id    : string;
    client_secret: string;
    redirect_url : string;
    scopes       : any;

    constructor(private http: Http) { }

    activate() {
        this.http.get('/api/Github/getClientId').map(res => res.json()).subscribe(
            data => this.client_id = data,
            error => console.log(error),
            () => { // TODO: Delete log code.
                console.log(this.client_id);
            }
        );
        this.http.get('/api/Github/getClientSecret').map(res => res.json()).subscribe(
            data => this.client_secret = data,
            error => console.log(error),
            () => { // TODO: Delete log code.
                console.log(this.client_secret);
            }
        );
        this.http.get('/api/Github/getRedirectUrl').map(res => res.json()).subscribe(
            data => this.redirect_url = data,
            error => console.log(error),
            () => { // TODO: Delete log code.
                console.log(this.redirect_url);
            }
        );
        this.http.get('/api/Github/getScopes').map(res => res.json()).subscribe(
            data => this.scopes = JSON.parse(data),
            error => console.log(error),
            () => { // TODO: Delete log code.
                console.log(this.scopes);
            }
        );


        /*
        this.h = new Headers();
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
