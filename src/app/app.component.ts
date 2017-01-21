import { Component } from "@angular/core";

/**
 * App container component.
 */
@Component({
    selector: "app",
    template: `
        <sidebar></sidebar>
        <div class="pusher" id="icerik">
            <router-outlet></router-outlet>
        </div>
    `
})
export class AppComponent { }
