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

    addNote(body: string, date: Date) {
        const data = {
            'Body': body,
            'Date': this.processDate(date)
        };

        return this.http.post(this.APIUrl + '/api/notes/addnote', data, {
            headers: this.h
        }).map(res => res.json());
    }

    getUserNotes() {
        return this.http.get(this.APIUrl + '/api/notes/getmynotes', {
            headers: this.h
        }).map(res => res.json());
    }

    getUserNotesForDate(date: Date) {
        const s: URLSearchParams = new URLSearchParams();
        s.set('date', this.processDate(date));
        console.log(s);
        return this.http.get(this.APIUrl + '/api/notes/getnotesfordate', {
            headers: this.h,
            search : s
        }).map(res => res.json());
    }

    private processDate(date: Date): string {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return day + '.' + month + '.' + year;
    }

    private setAuthorizationHeader() {
        this.h.append('Authorization', 'bearer ' + localStorage.getItem('ajanda_auth_token'));
    }
}
