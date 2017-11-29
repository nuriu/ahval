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
    @Input() notesPerDate: Array<DateItemViewModel>;
    @Input() ghIssuesPerDate: Array<DateItemViewModel>;

    constructor(private weeklyService: WeeklyService,
                private userService: UserService) {}

    ngOnInit() {
        this.fillDates(new Date());
        this.fillNotes();
        this.fillGitHubIssues();
    }

    fillDates(date: Date) {
        this.notesPerDate = new Array<DateItemViewModel>();
        this.ghIssuesPerDate = new Array<DateItemViewModel>();

        const monday = new Date();
        monday.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));

        this.notesPerDate.push({
            date : monday,
            items: new Array<Object>()
        });

        this.ghIssuesPerDate.push({
            date : monday,
            items: new Array<Object>()
        });

        for (let i = 0; i < 6; i++) {
            this.notesPerDate.push({
                date : new Date(date.setDate(monday.getDate() + i + 1)),
                items: new Array<Object>()
            });
            this.ghIssuesPerDate.push({
                date : new Date(date.setDate(monday.getDate() + i + 1)),
                items: new Array<Object>()
            });
        }
    }

    fillNotes() {
        this.weeklyService.getUserNotesForWeek(this.notesPerDate[0].date).subscribe((res: any) => {
            res.forEach(note => {
                this.notesPerDate.forEach(element => {
                    if (note.date === this.weeklyService.processDate(element.date)) {
                        element.items.push(note);
                    }
                });
            });
        });
    }

    fillGitHubIssues() {
        this.weeklyService.getIssuesForWeek(this.ghIssuesPerDate[0].date).subscribe((res: any) => {
            res.forEach(issue => {
                console.log(issue);
                this.ghIssuesPerDate.forEach(element => {
                    if (issue.date === this.weeklyService.processDate(element.date)) {
                        element.items.push(issue);
                    }
                });
            });
        });
    }

    incrementWeek() {
        for (let i = 0; i < this.notesPerDate.length; i++) {
            this.notesPerDate[i].date.setDate(this.notesPerDate[i].date.getDate() + 7);
            this.notesPerDate[i].items = new Array<Object>();
            this.ghIssuesPerDate[i].date.setDate(this.ghIssuesPerDate[i].date.getDate() + 7);
            this.ghIssuesPerDate[i].items = new Array<Object>();
        }

        this.fillNotes();
        this.fillGitHubIssues();
    }

    decrementWeek() {
        for (let i = 0; i < this.notesPerDate.length; i++) {
            this.notesPerDate[i].date.setDate(this.notesPerDate[i].date.getDate() - 7);
            this.notesPerDate[i].items = new Array<Object>();
            this.ghIssuesPerDate[i].date.setDate(this.ghIssuesPerDate[i].date.getDate() - 7);
            this.ghIssuesPerDate[i].items = new Array<Object>();
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
                    const i = this.ghIssuesPerDate[index].items.indexOf(item, 0);

                    if (i > -1) {
                        this.ghIssuesPerDate[index].items.splice(i, 1);
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
