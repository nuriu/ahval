import { Component } from '@angular/core';

import * as UIkit from 'uikit';
import * as Icons from 'uikit/dist/js/uikit-icons';

@Component({
    selector   : 'app',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.css']
})
export class AppComponent {
    constructor() {
        UIkit.use(Icons);
    }
}
