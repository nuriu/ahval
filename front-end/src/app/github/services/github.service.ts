import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';



@Injectable()
export class GitHubService {
    private token: string;

    constructor(private http: HttpClient) { }

    setToken(token: string) {
        this.token = token;
    }

    getUser() {
        return this.http.get('https://api.github.com/user', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'token ' + this.token
            })
        });
    }

    getUserAvatarLink() {
        return this.http.get('https://api.github.com/user', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'token ' + this.token
            })
        });
    }

    getRepos() {
        return this.http.get('https://api.github.com/user/repos', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'token ' + this.token
            })
        });
    }

    getUserRepos(login: string, sort: string, direction: string, page?: number, perPage?: number) {
        const p = new HttpParams();

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
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'token ' + this.token
            }),
            params : p
        });
    }

    getUserReceivedEvents(login: string, page: number) {
        return this.http.get('https://api.github.com/users/' + login + '/received_events?page=' + page, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'token ' + this.token
            })
        });
    }

    getFollowingUsers(login: string, page?: number, perPage?: number) {
        const p = new HttpParams();

        if (perPage) {
            p.set('per_page', perPage.toString());
        } else {
            p.set('per_page', '100');
        }

        if (page) {
            p.set('page', page.toString());
        }

        return this.http.get('https://api.github.com/users/' + login + '/following', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'token ' + this.token
            }),
            params: p
        });
    }

    getFollowers(login: string, page?: number, perPage?: number) {
        const p = new HttpParams();

        if (perPage) {
            p.set('per_page', perPage.toString());
        } else {
            p.set('per_page', '100');
        }

        if (page) {
            p.set('page', page.toString());
        }

        return this.http.get('https://api.github.com/users/' + login + '/followers', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'token ' + this.token
            }),
            params: p
        });
    }

    getUserInfo(login: string) {
        return this.http.get('https://api.github.com/users/' + login, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'token ' + this.token
            })
        });
    }

    getOrgInfo(name: string) {
        return this.http.get('https://api.github.com/orgs/' + name, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'token ' + this.token
            })
        });
    }

    getRepoInfo(owner: string, name: string) {
        return this.http.get('https://api.github.com/repos/' + owner + '/' + name, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'token ' + this.token
            })
        });
    }

    getIssueInfo(owner: string, repo: string, no: number) {

        return this.http.get('https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + no, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.VERSION.html+json',
                'Authorization': 'token ' + this.token
            })
        });
    }

    getOrgMembers(name: string, page?: number, perPage?: number) {
        const p = new HttpParams();

        if (perPage) {
            p.set('per_page', perPage.toString());
        } else {
            p.set('per_page', '100');
        }

        if (page) {
            p.set('page', page.toString());
        }
        return this.http.get('https://api.github.com/orgs/' + name + '/members', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'token ' + this.token
            }),
            params: p
        });
    }

    getUserOrgs(login: string) {
        return this.http.get('https://api.github.com/users/' + login + '/orgs', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'token ' + this.token
            })
        });
    }

    getCommits(owner: string, name: string) {
        return this.http.get('https://api.github.com/repos/' + owner + '/' + name + '/commits', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'token ' + this.token
            })
        });
    }

    getIssues(owner: string, name: string) {
        return this.http.get('https://api.github.com/repos/' + owner + '/' + name + '/issues', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'token ' + this.token
            })
        });
    }

    getIssuesEvents(owner: string, name: string) {
        return this.http.get('https://api.github.com/repos/' + owner + '/' + name + '/issues/events', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'token ' + this.token
            })
        });
    }

    getIssueEvents(owner: string, name: string, number) {
        return this.http.get('https://api.github.com/repos/' + owner + '/' + name + '/issues/' + number + '/events', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'token ' + this.token
            })
        });
    }

    getIssueComments(owner: string, repo: string, number: number) {
        return this.http.get('https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + number + '/comments', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.VERSION.html+json',
                'Authorization': 'token ' + this.token
            })
        });
    }

    addIssueComment(owner: string, repo: string, number: number, comment: string) {
        return this.http.post('https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + number + '/comments', {
            'body': comment
        }, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'token ' + this.token
            })
        });
    }
}
