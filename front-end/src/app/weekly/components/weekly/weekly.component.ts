import { Component, Input, OnInit } from '@angular/core';

import { UserService } from '../../../services/user.service';
import { WeeklyService } from '../../services/weekly.service';

import * as $ from 'jquery';
import * as UIkit from 'uikit';



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
        this.weeklyService.getUserNotesForWeek(this.itemsPerDate[0].date).subscribe((res: any) => {
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
            this.itemsPerDate[i].items = new Array<Object>();
        }

        this.fillNotes();
    }

    decrementWeek() {
        for (let i = 0; i < this.itemsPerDate.length; i++) {
            this.itemsPerDate[i].date.setDate(this.itemsPerDate[i].date.getDate() - 7);
            this.itemsPerDate[i].items = new Array<Object>();
        }

        this.fillNotes();
    }

    addNote(index: string) {
        if ($('#noteForm' + index + '>textarea').val() != null &&
            $('#noteForm' + index + '>textarea').val().toString().trim() !== '') {
            this.weeklyService.addNote($('#noteForm' + index + '>textarea').val().toString(),
                                       this.itemsPerDate[index].date).subscribe(res => {
                if (res != null) {
                    this.itemsPerDate[index].items.push(res);

                    UIkit.notification('<span uk-icon="icon: check"></span> Notunuz başarıyla eklendi!', {
                        status: 'success',
                        pos: 'top-center'
                    });

                    $('#noteForm' + index).toggle();
                    $('#noteForm' + index + '>textarea').val('');
                } else {
                    UIkit.notification('Not ekleme işlemi başarısızlıkla sonuçlandı!', {
                        status: 'danger',
                        pos: 'top-center'
                    });
                }
            });
        } else {
            UIkit.notification('Boş not eklenemez!', {
                status: 'danger',
                pos: 'top-center'
            });
        }
    }

    removeNote(item: any, index: number) {
        if (item !== null && item.id.trim() !== '') {
            this.weeklyService.removeNote(item.id).subscribe(res => {
                if (res === true) {
                    const i = this.itemsPerDate[index].items.indexOf(item, 0);
                    if (i > -1) {
                        this.itemsPerDate[index].items.splice(i, 1);
                    }

                    UIkit.notification('<span uk-icon="icon: check"></span> Notunuz başarıyla silindi!', {
                        status: 'success',
                        pos: 'top-center'
                    });
                } else {
                    UIkit.notification('Not silme işlemi başarısızlıkla sonuçlandı!', {
                        status: 'danger',
                        pos: 'top-center'
                    });
                }
            });
        }
    }

    toggleNoteForm(index: string) {
        $('#noteForm' + index).toggle();
    }
}
