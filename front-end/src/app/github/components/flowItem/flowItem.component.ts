import { Component, Input, OnInit } from '@angular/core';



@Component({
    selector: 'app-github-flowitem',
    templateUrl: 'flowItem.component.html',
    styleUrls: ['flowItem.component.css']
})
export class FlowItemComponent implements OnInit {
    @Input() image;
    @Input() tooltip;
    @Input() title;
    @Input() date;
    @Input() content;
    @Input() footer;

    constructor() { }

    ngOnInit() {
        this.date = new Date(this.date);
    }
}
