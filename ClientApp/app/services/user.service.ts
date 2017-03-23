import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { isBrowser } from 'angular2-universal';

@Injectable()
export class UserService {
    private loggedIn = false;

    constructor(private http: Http) {
        if (isBrowser)
            this.loggedIn = !!localStorage.getItem('ajanda_auth_token');
    }

    login(username: string, password: string) {
        let data = new URLSearchParams();
        data.append('username', username);
        data.append('password', password);

        let body = data.toString();

        return this.http.post('/api/User/Login', data).map(res => res.json())
            .map((res) => {
                if (res != 'null') {
                    this.loggedIn = true;
                    if (isBrowser)
                        localStorage.setItem('ajanda_auth_token', res);
                    return "success";
                } else {
                    return res;
                }
            });
    }

    logout() {
        if (isBrowser)
            localStorage.removeItem('ajanda_auth_token');
        this.loggedIn = false;
    }

    isLoggedIn() {
        return this.loggedIn;
    }
}
