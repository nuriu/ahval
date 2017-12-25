import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';



@Injectable()
export class HackerNewsService {
    private APIUrl = 'https://hacker-news.firebaseio.com/v0';

    constructor(private http: HttpClient) { }

    getItem(id: string) {
        return this.http.get(this.APIUrl + '/item/' + id + '.json?print=pretty');
    }

    getTopStories() {
        return this.http.get(this.APIUrl + '/topstories.json?print=pretty');
    }

    getNewStories() {
        return this.http.get(this.APIUrl + '/newstories.json?print=pretty');
    }

    getBestStories() {
        return this.http.get(this.APIUrl + '/beststories.json?print=pretty');
    }

    getAskStories() {
        return this.http.get(this.APIUrl + '/askstories.json?print=pretty');
    }

    getShowStories() {
        return this.http.get(this.APIUrl + '/showstories.json?print=pretty');
    }

    getJobStories() {
        return this.http.get(this.APIUrl + '/jobstories.json?print=pretty');
    }
}
