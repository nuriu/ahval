import { Component } from "@angular/core";

@Component({
    selector: "home",
    template: `
    <h2>Home Loaded.</h2>
    <avatar [avatarLink]="avatar_link" [name]="nameLastName" [bio]="biog"></avatar>
    `
})

/**
 * Class for home component.
 */
export class HomeComponent {
    avatar_link = "https://avatars0.githubusercontent.com/u/9089783?v=3&s=88";
    nameLastName = "Nuri Uzunoğlu";
    biog = "biography";
}
