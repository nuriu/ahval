import { Component, Input, OnInit } from '@angular/core';

import { UserService } from '../../../services/user.service';
import { WeeklyService } from '../../services/weekly.service';



@Component({
    selector   : 'app-weekly',
    templateUrl: './weekly.component.html',
    styleUrls  : ['./weekly.component.css']
})
export class WeeklyComponent implements OnInit {
    @Input() dates: Array<Date>;

    constructor(private weeklyService: WeeklyService,
                private userService: UserService) {}

    ngOnInit() {
        this.dates = new Array<Date>();
        this.fillDates(new Date());
    }

    fillDates(date: Date) {
        const monday = new Date();
        monday.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));

        this.dates.push(monday);

        for (let i = 0; i < 6; i++) {
            this.dates.push(new Date(date.setDate(monday.getDate() + i + 1)));
        }
    }

    incrementWeek() {
        for (let i = 0; i < this.dates.length; i++) {
            this.dates[i].setDate(this.dates[i].getDate() + 7);
        }
    }

    decrementWeek() {
        for (let i = 0; i < this.dates.length; i++) {
            this.dates[i].setDate(this.dates[i].getDate() - 7);
        }
    }
}
