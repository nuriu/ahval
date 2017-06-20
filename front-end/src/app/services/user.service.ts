import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

@Injectable()
export class UserService {
    private APIUrl = 'http://localhost:8080';
    private loggedIn = false;

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
        this.loggedIn = false;
    }

    isLoggedIn() {
        return this.loggedIn;
    }
}
