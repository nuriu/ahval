import { Component, Input, OnInit } from '@angular/core';

import { UserService } from '../../../services/user.service';
import { WeeklyService } from '../../services/weekly.service';

import * as $ from 'jquery';
import * as UIkit from 'uikit';
import * as moment from 'moment';



interface DateItemViewModel {
    date: moment.Moment;
    items: Array<Object>;
}

@Component({
    selector   : 'app-weekly',
    templateUrl: './weekly.component.html',
    styleUrls  : ['./weekly.component.css']
})
export class WeeklyComponent implements OnInit {
    @Input() notesPerDate: Array<DateItemViewModel>;
    @Input() issuesPerDate: Array<DateItemViewModel>;

    constructor(private weeklyService: WeeklyService,
                private userService: UserService) {}

    ngOnInit() {
        moment.locale('tr');
        this.fillDates();
        this.fillNotes();
        this.fillIssues();
    }

    fillDates() {
        this.notesPerDate = new Array<DateItemViewModel>();
        this.issuesPerDate = new Array<DateItemViewModel>();

        for (let i = 0; i < 7; i++) {
            this.notesPerDate.push({
                date : moment().startOf('isoWeek').add(i, 'days'),
                items: new Array<Object>()
            });

            this.issuesPerDate.push({
                date : moment().startOf('isoWeek').add(i, 'days'),
                items: new Array<Object>()
            });
        }
    }

    fillNotes() {
        this.weeklyService.getUserNotesForWeek(this.notesPerDate[0].date).subscribe((res: any) => {
            res.forEach(note => {
                this.notesPerDate.forEach(element => {
                    if (note.date === element.date.format('DD.MM.Y')) {
                        element.items.push(note);
                    }
                });
            });
        });
    }

    fillIssues() {
        this.weeklyService.getIssuesForWeek(this.issuesPerDate[0].date).subscribe((res: any) => {
            res.forEach(issue => {
                console.log(issue);
                this.issuesPerDate.forEach(element => {
                    if (issue.date === element.date.format('DD.MM.Y')) {
                        element.items.push(issue);
                    }
                });
            });
        });
    }

    incrementWeek() {
        for (let i = 0; i < this.notesPerDate.length; i++) {
            this.notesPerDate[i].date.add(7, 'days');
            this.notesPerDate[i].items = new Array<Object>();

            this.issuesPerDate[i].date.add(7, 'days');
            this.issuesPerDate[i].items = new Array<Object>();
        }

        this.fillNotes();
        this.fillGitHubIssues();
    }

    decrementWeek() {
        for (let i = 0; i < this.notesPerDate.length; i++) {
            this.notesPerDate[i].date.subtract(7, 'days');
            this.notesPerDate[i].items = new Array<Object>();

            this.issuesPerDate[i].date.subtract(7, 'days');
            this.issuesPerDate[i].items = new Array<Object>();
        }

        this.fillNotes();
        this.fillGitHubIssues();
    }

    addNote(index: string) {
        if ($('#noteForm' + index + '>textarea').val() != null &&
            $('#noteForm' + index + '>textarea').val().toString().trim() !== '') {
            this.weeklyService.addNote($('#noteForm' + index + '>textarea').val().toString(),
                                       this.notesPerDate[index].date).subscribe(res => {
                if (res != null) {
                    this.notesPerDate[index].items.push(res);

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
                    const i = this.notesPerDate[index].items.indexOf(item, 0);

                    if (i > -1) {
                        this.notesPerDate[index].items.splice(i, 1);
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

    removeIssue(item: any, index: number) {
        if (item !== null && item.id.trim() !== '') {
            this.weeklyService.removeIssue(item.id).subscribe(res => {
                if (res === true) {
                    const i = this.issuesPerDate[index].items.indexOf(item, 0);

                    if (i > -1) {
                        this.issuesPerDate[index].items.splice(i, 1);
                    }

                    UIkit.notification('<span uk-icon="icon: check"></span> İş kaydınız başarıyla silindi!', {
                        status: 'success',
                        pos: 'top-center'
                    });
                } else {
                    UIkit.notification('İş kaydı silme işlemi başarısızlıkla sonuçlandı!', {
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
