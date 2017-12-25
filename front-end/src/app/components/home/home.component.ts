import { Component, OnInit, Input } from '@angular/core';

import { HackerNewsService } from '../../services/hackernews.service';



@Component({
    selector   : 'app-home',
    templateUrl: './home.component.html',
    styleUrls  : ['./home.component.css']
})
export class HomeComponent implements OnInit {
    private currentNewsType = 'top';
    @Input() news: Array<any>;

    constructor(private hackerNewsService: HackerNewsService) { }

    ngOnInit() {
        this.news = new Array<any>();

        this.hackerNewsService.getTopStories().subscribe((data: Array<string>) => data.forEach(element => {
            this.hackerNewsService.getItem(element).subscribe((item) => this.news.push(item));
        }));
    }

    switchNewsTo(type: string) {
        if (type !== this.currentNewsType) {
            this.currentNewsType = type;
            this.news = new Array<any>();

            switch (type) {
                case 'top':
                    this.hackerNewsService.getTopStories().subscribe((data: Array<string>) => data.forEach(element => {
                        this.hackerNewsService.getItem(element).subscribe((item) => this.news.push(item));
                    }));
                    break;

                case 'best':
                    this.hackerNewsService.getBestStories().subscribe((data: Array<string>) => data.forEach(element => {
                        this.hackerNewsService.getItem(element).subscribe((item) => this.news.push(item));
                    }));
                    break;

                case 'new':
                    this.hackerNewsService.getNewStories().subscribe((data: Array<string>) => data.forEach(element => {
                        this.hackerNewsService.getItem(element).subscribe((item) => this.news.push(item));
                    }));
                    break;

                case 'ask':
                    this.hackerNewsService.getAskStories().subscribe((data: Array<string>) => data.forEach(element => {
                        this.hackerNewsService.getItem(element).subscribe((item) => this.news.push(item));
                    }));
                break;

                case 'show':
                    this.hackerNewsService.getShowStories().subscribe((data: Array<string>) => data.forEach(element => {
                        this.hackerNewsService.getItem(element).subscribe((item) => this.news.push(item));
                    }));
                break;

                case 'job':
                    this.hackerNewsService.getJobStories().subscribe((data: Array<string>) => data.forEach(element => {
                        this.hackerNewsService.getItem(element).subscribe((item) => this.news.push(item));
                    }));
                break;

                default:
                    break;
            }
        }
    }
}

