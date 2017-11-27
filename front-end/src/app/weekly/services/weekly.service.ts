import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';



@Injectable()
export class WeeklyService {
    private APIUrl = 'http://localhost:5000/api';

    constructor(private http: HttpClient) { }

    addNote(body: string, date: Date) {
        const data = {
            'Body': body,
            'Date': this.processDate(date)
        };

        return this.http.post(this.APIUrl + '/notes/addnote', data, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('ajanda_auth_token')
            })
        });
    }

    addIssue(component: string, repoIdentifier: string, id: number, date: Date) {
        const data = {
            'ComponentName': component,
            'RepoIdentifier': repoIdentifier,
            'IssueNumber': id,
            'Date': this.processDate(date),
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

    getUserNotes() {
        return this.http.get(this.APIUrl + '/notes/getmynotes', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('ajanda_auth_token')
            })
        });
    }

    getUserNotesForWeek(mondayDate: Date) {
        return this.http.get(this.APIUrl + '/notes/getnotesforweek', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('ajanda_auth_token')
            }),
            params : new HttpParams().set('monday', this.processDate(mondayDate))
        });
    }

    processDate(date: Date): string {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        if (month < 10) {
            return day + '.0' + month + '.' + year;
        } else {
            return day + '.' + month + '.' + year;
        }
    }
}
