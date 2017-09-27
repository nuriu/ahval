import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';



@Injectable()
export class GitHubService {
    private APIUrl = 'http://localhost:5000';
    private h    : Headers = new Headers();
    private token: string;
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

    getUserRepos(login: string, sort: string, direction: string, page?: number, perPage?: number) {
        const p = new URLSearchParams();

        p.set('sort', sort);
        p.set('direction', direction);

        if (perPage) {
            p.set('per_page', perPage.toString());
        } else {
            p.set('per_page', '100');
        }

        if (page) {
            p.set('page', page.toString());
        }

        return this.http.get('https://api.github.com/users/' + login + '/repos', {
            headers: this.h,
            search : p
        }).map(res => res.json());
    }

    getUserReceivedEvents(login: string, page: number) {
        return this.http.get('https://api.github.com/users/' + login + '/received_events?page=' + page, {
            headers: this.h
        }).map(res => res.json());
    }

    getFollowingUsers(login: string, page?: number, perPage?: number) {
        const p = new URLSearchParams();

        if (perPage) {
            p.set('per_page', perPage.toString());
        } else {
            p.set('per_page', '100');
        }

        if (page) {
            p.set('page', page.toString());
        }

        return this.http.get('https://api.github.com/users/' + login + '/following', {
            headers: this.h,
            search: p
        }).map(res => res.json());
    }

    getFollowers(login: string, page?: number, perPage?: number) {
        const p = new URLSearchParams();

        if (perPage) {
            p.set('per_page', perPage.toString());
        } else {
            p.set('per_page', '100');
        }

        if (page) {
            p.set('page', page.toString());
        }

        return this.http.get('https://api.github.com/users/' + login + '/followers', {
            headers: this.h,
            search: p
        }).map(res => res.json());
    }

    getUserInfo(login: string) {
        return this.http.get('https://api.github.com/users/' + login, {
            headers: this.h
        }).map(res => res.json());
    }

    getRepoInfo(owner: string, name: string) {
        return this.http.get('https://api.github.com/repos/' + owner + '/' + name, {
            headers: this.h
        }).map(res => res.json());
    }

    getOrgInfo(name: string) {
        return this.http.get('https://api.github.com/orgs/' + name, {
            headers: this.h
        }).map(res => res.json());
    }

    getUserOrgs(login: string) {
        return this.http.get('https://api.github.com/users/' + login + '/orgs', {
            headers: this.h
        }).map(res => res.json());
    }

    getCommits(owner: string, name: string) {
        return this.http.get('https://api.github.com/repos/' + owner + '/' + name + '/commits', {
            headers: this.h
        }).map(res => res.json());
    }

    getIssues(owner: string, name: string) {
        return this.http.get('https://api.github.com/repos/' + owner + '/' + name + '/issues', {
            headers: this.h
        }).map(res => res.json());
    }

    getIssueEvents(owner: string, name: string) {
        return this.http.get('https://api.github.com/repos/' + owner + '/' + name + '/issues/events', {
            headers: this.h
        }).map(res => res.json());
    }
}
