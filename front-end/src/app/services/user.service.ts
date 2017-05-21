import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

@Injectable()
export class UserService {
    private APIUrl = 'http://localhost:5000';
    private loggedIn = false;

    constructor(private http: Http) {
        this.loggedIn = !!localStorage.getItem('ajanda_auth_token');
    }

    login(username: string, password: string) {
        let data = new URLSearchParams();
        data.append('username', username);
        data.append('password', password);

        return this.http.post(this.APIUrl + '/api/User/Login', data).map(res => res.json())
            .map((res) => {
                if (res != 'null') {
                    this.loggedIn = true;
                    localStorage.setItem('ajanda_auth_token', res);
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

        return this.http.post('this.APIUrl + /api/User/Register', data).map(res => res.json());
    }

    logout() {
        localStorage.removeItem('ajanda_auth_token');
        this.loggedIn = false;
    }

    isLoggedIn() {
        return this.loggedIn;
    }

    getAuthorizedComponents() {

    }
}
