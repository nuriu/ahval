import { Component } from "@angular/core";

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
