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
    token        : string;

    constructor(private http: Http) { }

    activate() {
        this. h = new Headers();

        this.http.get('/api/Github/getToken').map(res => res.json()).subscribe(
            data  => this.token = data,
            error => console.log(error),
            ()    => {
                if (this.token == null || this.token == "null") {
                    this.http.get('/api/Github/getClientId').map(res => res.json()).subscribe(
                        data  => this.client_id = data,
                        error => console.log(error),
                        ()    => {
                            this.http.get('/api/Github/getRedirectUrl').map(res => res.json()).subscribe(
                                data  => this.redirect_url = data,
                                error => console.log(error),
                                ()    => {
                                    this.http.get('/api/Github/getScopes').map(res => res.json()).subscribe(
                                        data  => this.scopes = JSON.parse(data),
                                        error => console.log(error),
                                        ()    => {
                                            let url = 'https://github.com/login/oauth/authorize';
                                            window.location.href = url + "?&client_id=" +
                                                this.client_id + "&redirect_uri=" +
                                                this.redirect_url + "&scope=" +
                                                this.scopes;
                                        }
                                    );
                                }
                            );
                        }
                    );
                } else {
                    // TODO: Delete log code.
                    console.log('Token: ' + this.token);
                    this.h.set('Authorization', 'token ' + this.token);
                }
            }
        );
    }



    getUser() {
        if (this.h.get("Authorization") == null) {
            this.h.set('Authorization', 'token ' + this.token);
        }

        console.log(this.h.get("Authorization"));
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
