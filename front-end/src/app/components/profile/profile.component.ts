import { Component, OnInit, Input } from '@angular/core';

import { UserService } from '../../services/user.service';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls  : ['./profile.component.css']
})
export class ProfileComponent {
    @Input() user;
    constructor(private userService: UserService) { }

    ngOnInit() {
        this.userService.getProfileInfo().subscribe((res) => {
            if (res) {
                console.log(res);
                this.user = res;
            } else {
                // TODO: show error message.
            }
        });
    }
}
