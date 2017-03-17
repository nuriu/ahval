import { Component, Input } from '@angular/core';

/**
 * Class for avatar component.
 */
@Component({
    selector           : 'avatar',
    templateUrl        : './avatar.component.html'
})
export class AvatarComponent {
    /**
     * Image link.
     */
    @Input() avatarLink: string;
    /**
     * Popup title.
     */
    @Input() name      : string;
}
