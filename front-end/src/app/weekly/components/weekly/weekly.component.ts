import { Component, Input, OnInit } from '@angular/core';

import { UserService } from '../../../services/user.service';
import { WeeklyService } from '../../services/weekly.service';

interface DateItemViewModel {
    date: Date;
    items: Array<Object>;
}

@Component({
    selector   : 'app-weekly',
    templateUrl: './weekly.component.html',
    styleUrls  : ['./weekly.component.css']
})
export class WeeklyComponent implements OnInit {
    @Input() itemsPerDate: Array<DateItemViewModel>;

    constructor(private weeklyService: WeeklyService,
                private userService: UserService) {}

    ngOnInit() {
        this.weeklyService.activate();

        this.fillDates(new Date());
        this.fillNotes();
    }

    fillDates(date: Date) {
        this.itemsPerDate = new Array<DateItemViewModel>();
        const monday = new Date();
        monday.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));

        this.itemsPerDate.push({
            date : monday,
            items: new Array<Object>()
        });

        for (let i = 0; i < 6; i++) {
            this.itemsPerDate.push({
                date : new Date(date.setDate(monday.getDate() + i + 1)),
                items: new Array<Object>()
            });
        }
    }

    fillNotes() {
        this.weeklyService.getUserNotesForWeek(this.itemsPerDate[0].date).subscribe(res => {
            res.forEach(note => {
                this.itemsPerDate.forEach(element => {
                    if (note.date === this.weeklyService.processDate(element.date)) {
                        element.items.push(note);
                    }
                });
            });
        });
    }

    incrementWeek() {
        for (let i = 0; i < this.itemsPerDate.length; i++) {
            this.itemsPerDate[i].date.setDate(this.itemsPerDate[i].date.getDate() + 7);
        }

        this.fillDates(this.itemsPerDate[0].date);
        this.fillNotes();
    }

    decrementWeek() {
        for (let i = 0; i < this.itemsPerDate.length; i++) {
            this.itemsPerDate[i].date.setDate(this.itemsPerDate[i].date.getDate() - 7);
        }

        this.fillDates(this.itemsPerDate[0].date);
        this.fillNotes();
    }
}
