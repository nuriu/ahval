import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class UserService {
    private APIUrl = 'http://localhost:8080';
    private loggedIn = false;
    // private h : Headers = new Headers();

    constructor(private http: Http) {
        this.loggedIn = !!localStorage.getItem('ajanda_auth_token');
    }

    login(username: string, password: string) {
        let data = new URLSearchParams();
        data.append('username', username);
        data.append('password', password);

        return this.http.post(this.APIUrl + '/api/authenticate', data).map(res => res.json())
            .map((res) => {
                if (res.success) {
                    this.loggedIn = true;
                    localStorage.setItem('ajanda_auth_token', res.token);
                    // this.h.set('x-access-token', localStorage.getItem('ajanda_auth_token'));
                    return "success";
                } else {
                    this.loggedIn = false;
                    return res;
                }
            });
    }

    register(username: string, password: string) {
        let data = new URLSearchParams();
        data.append('username', username);
        data.append('password', password);

        return this.http.post(this.APIUrl + '/api/register', data).map(res => res.json())
            .map((res) => {
                if (res.success) {
                    return "success";
                } else {
                    return res;
                }
            });
    }

    logout() {
        localStorage.removeItem('ajanda_auth_token');
        // this.h.delete('x-access-token');
        this.loggedIn = false;
    }

    isLoggedIn() {
        return this.loggedIn;
    }

    // TODO: resolve cors error with 'OPTIONS' type request
    getProfileInfo() {
        return this.http.get(this.APIUrl + '/api/me?token=' + localStorage.getItem('ajanda_auth_token'))
            .map(res => res.json());
    }

    getGitHubToken() {
        return this.http.get(this.APIUrl + '/api/me/getGitHubToken?token=' + localStorage.getItem('ajanda_auth_token'))
            .map(res => res.json());
    }
}
