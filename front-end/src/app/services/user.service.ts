import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {
    private APIUrl         = 'http://localhost:5000/api';

    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        const data = {
            'Username': username,
            'Password': password
        };

        return this.http.post(this.APIUrl + '/authenticate', data, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).map(res => {
            if (res['access_token'] != null) {
                localStorage.setItem('ajanda_auth_token', res['access_token']);
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

        return this.http.post(this.APIUrl + '/register', data)
            .map(res => {
                return res['success'];
            });
    }

    remove() {
        return this.http.delete(this.APIUrl + '/account/removeaccount', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('ajanda_auth_token')
            })
        });
    }

    logout() {
        localStorage.removeItem('ajanda_auth_token');
    }

    update(currentPassword: string, newPassword: string, newEmailAddress: string) {
        return this.http.put(this.APIUrl + '/account/update', {
            'OldPassword': currentPassword,
            'NewPassword': newPassword,
            'NewEmailAddress': newEmailAddress
        }, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('ajanda_auth_token')
            })
        });
    }

    isLoggedIn() {
        return !!localStorage.getItem('ajanda_auth_token');
    }

    getProfileInfo() {
        return this.http.get(this.APIUrl + '/account/me', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('ajanda_auth_token')
            })
        });
    }

    getComponentList() {
        return this.http.get(this.APIUrl + '/account/getusercomponents', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('ajanda_auth_token')
            })
        });
    }

    hasComponent(component: string) {
        return this.http.get(this.APIUrl + '/account/hascomponent',
        {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('ajanda_auth_token')
            }),
            params: new HttpParams().set('componentName', component)
        });
    }

    getToken(component: string) {
        return this.http.get(this.APIUrl + '/account/gettokenforcomponent',
        {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('ajanda_auth_token')
            }),
            params: new HttpParams().set('componentName', component)
        });
    }
}
