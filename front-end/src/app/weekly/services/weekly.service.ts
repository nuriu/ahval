import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';



@Injectable()
export class WeeklyService {
    private APIUrl = 'http://localhost:5000';
    private h    : Headers = new Headers();

    constructor(private http: Http) {
        this.h.append('Content-Type', 'application/json');
    }

    activate() {
        if (this.h.get('Authorization') == null) {
            this.setAuthorizationHeader();
        }
    }

    private setAuthorizationHeader() {
        this.h.append('Authorization', 'bearer ' + localStorage.getItem('ajanda_auth_token'));
    }
}
