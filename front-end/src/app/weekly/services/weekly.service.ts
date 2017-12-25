import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import * as moment from 'moment';



@Injectable()
export class WeeklyService {
    private APIUrl = 'http://localhost:5000/api';

    constructor(private http: HttpClient) { }

    addNote(body: string, date: moment.Moment) {
        const data = {
            'Body': body,
            'Date': date.format('DD.MM.Y')
        };

        return this.http.post(this.APIUrl + '/notes/addnote', data, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('ajanda_auth_token')
            })
        });
    }

    addIssue(component: string, repoIdentifier: string, id: number, date: moment.Moment) {
        const data = {
            'ComponentName': component,
            'RepoIdentifier': repoIdentifier,
            'IssueNumber': id,
            'Date': date.format('DD.MM.Y'),
            'RowNumber': 0
        };

        return this.http.post(this.APIUrl + '/issues/addissue', data, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('ajanda_auth_token')
            })
        });
    }

    removeNote(id: string) {
        return this.http.post(this.APIUrl + '/notes/removenote', {
            'Id': id
        }, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('ajanda_auth_token')
            })
        });
    }

    removeIssue(id: string) {
        const data = {
            'Id': id
        };
        return this.http.post(this.APIUrl + '/issues/removeissue', data, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('ajanda_auth_token')
            })
        });
    }

    getUserNotes() {
        return this.http.get(this.APIUrl + '/notes/getmynotes', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('ajanda_auth_token')
            })
        });
    }

    getUserNotesForWeek(date: moment.Moment) {
        return this.http.get(this.APIUrl + '/notes/getnotesforweek', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('ajanda_auth_token')
            }),
            params : new HttpParams().set('monday', date.startOf('isoWeek').format('DD.MM.Y'))
        });
    }

    getIssuesForWeek(date: moment.Moment) {
        return this.http.get(this.APIUrl + '/issues/getissuesforweek', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('ajanda_auth_token')
            }),
            params : new HttpParams().set('monday', date.startOf('isoWeek').format('DD.MM.Y'))
        });
    }
}
