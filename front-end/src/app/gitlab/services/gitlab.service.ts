import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';



@Injectable()
export class GitLabService {
    private token: string;
    private APIUrl = 'https://gitlab.com/api/v4';

    constructor(private http: HttpClient) { }

    setToken(token: string) {
        this.token = token;
    }

    getUser() {
        return this.http.get(this.APIUrl + '/user', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Private-Token': this.token
            })
        });
    }

    getRepos() {
        return this.http.get(this.APIUrl + '/projects?owned=true', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Private-Token': this.token
            })
        });
    }

    getGroups() {
        return this.http.get(this.APIUrl + '/groups', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Private-Token': this.token
            })
        });
    }

    getEvents() {
        return this.http.get(this.APIUrl + '/events', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Private-Token': this.token
            })
        });
    }

    getUserInfo(login: string) {
        return this.http.get(this.APIUrl + '/users?username=' + login, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Private-Token': this.token
            })
        });
    }

    getUserDataWithId(id: string) {
        return this.http.get(this.APIUrl + '/users/' + id, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Private-Token': this.token
            })
        });
    }

    getUserRepos(login: string) {
        return this.http.get(this.APIUrl + '/users/' + login + '/projects', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Private-Token': this.token
            })
        });
    }

    getGroupInfo(name: string) {
        return this.http.get(this.APIUrl + '/groups/' + name, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Private-Token': this.token
            })
        });
    }

    getGroupProjects(name: string) {
        return this.http.get(this.APIUrl + '/groups/' + name + '/projects', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Private-Token': this.token
            })
        });
    }

    getGroupMembers(name: string) {
        return this.http.get(this.APIUrl + '/groups/' + name + '/members?per_page=100', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Private-Token': this.token
            })
        });
    }

    getGroupIssues(name: string) {
        return this.http.get(this.APIUrl + '/groups/' + name + '/issues', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Private-Token': this.token
            })
        });
    }

    getProject(owner: string, name: string) {
        return this.http.get(this.APIUrl + '/projects/' + encodeURIComponent(owner + '/' + name), {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Private-Token': this.token
            })
        });
    }

    getProjectCommits(owner: string, name: string) {
        return this.http.get(this.APIUrl + '/projects/' + encodeURIComponent(owner + '/' + name) + '/repository/commits', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Private-Token': this.token
            })
        });
    }

    getProjectIssues(owner: string, name: string) {
        return this.http.get(this.APIUrl + '/projects/' + encodeURIComponent(owner + '/' + name) + '/issues', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Private-Token': this.token
            })
        });
    }

    createProjectIssue(owner: string, name: string, title: string, desc?: string) {
        return this.http.post(this.APIUrl + '/projects/' + encodeURIComponent(owner + '/' + name) + '/issues', {
            title      : title,
            description: desc
        }, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Private-Token': this.token
            })
        });
    }
}
