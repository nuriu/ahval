import { Component, Input } from "@angular/core";

@Component({
    selector: "avatar",
    templateUrl: "avatar.component.html"
})

/**
 * Class for avatar component.
 */
export class AvatarComponent {
    @Input() avatarLink;
    @Input() name;
    @Input() bio;
}
