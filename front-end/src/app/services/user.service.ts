import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class UserService {
    private APIUrl     = 'http://localhost:5000';
    private h: Headers = new Headers();

    constructor(private http: Http) {
        this.h.append('Content-Type', 'application/json');
    }

    login(username: string, password: string) {
        const data = {
            'Username': username,
            'Password': password
        };

        return this.http.post(this.APIUrl + '/api/authenticate', data, {
            headers: this.h
        }).map(res => res.json()).map((res) => {
            if (res.access_token != null) {
                localStorage.setItem('ajanda_auth_token', res.access_token);
                this.h.append('Authorization', 'bearer ' + res.access_token);

                return true;
            }

            return false;
        });
    }

    register(username: string, password: string) {
        const data = {
            'Username': username,
            'Password': password
        };

        return this.http.post(this.APIUrl + '/api/register', data).map(res => res.json())
            .map((res) => {
                return res.success;
            });
    }

    logout() {
        localStorage.removeItem('ajanda_auth_token');
        this.loggedIn = false;
    }

    update(currentPassword: string, newPassword: string, newEmailAddress: string) {
        const data = {
            'OldPassword': currentPassword,
            'NewPassword': newPassword,
            'NewEmailAddress': newEmailAddress
        }

        return this.http.put(this.APIUrl + '/api/account/update', data, {
            headers: this.h
        }).map(res => res.json());
    }

    isLoggedIn() {
        return this.loggedIn;
        return !!localStorage.getItem('ajanda_auth_token');
    }

    // TODO: resolve cors error with 'OPTIONS' type request
    getProfileInfo() {
        if (this.h.get('Authorization') == null) {
            this.h.append('Authorization', 'bearer ' + localStorage.getItem('ajanda_auth_token'));
        }

        return this.http.get(this.APIUrl + '/api/account/me', { headers: this.h })
            .map(res => res.json());
    }

    getGitHubToken() {
        return this.http.get(this.APIUrl + '/api/me/getGitHubToken', { headers: this.h })
            .map(res => res.json());
    }
}
