import { Component, Input, OnInit } from '@angular/core';



@Component({
    selector: 'app-github-flowitemcard',
    templateUrl: 'flowItemCard.component.html'
})
export class FlowItemCardComponent implements OnInit {
    @Input() image;
    @Input() title;
    @Input() date;
    @Input() content;
    @Input() footer;

    constructor() { }

    ngOnInit() {
        this.date = new Date(this.date);
    }
}
