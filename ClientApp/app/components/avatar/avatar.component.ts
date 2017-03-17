import { Component, Input } from '@angular/core';

@Component({
    selector           : 'avatar',
    templateUrl        : './avatar.component.html'
})
export class AvatarComponent {
    @Input() avatarLink: string;
    @Input() name      : string;
}
