import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';



@Injectable()
export class WeeklyService {
    private APIUrl = 'http://localhost:5000';
    private h    : Headers = new Headers();

    constructor(private http: Http) {}
}
