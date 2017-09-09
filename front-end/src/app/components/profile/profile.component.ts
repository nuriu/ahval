import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import * as UIkit from 'uikit';

import { UserService } from '../../services/user.service';

@Component({
    selector   : 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls  : ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    @Input() user;

    updateForm: FormGroup;
    oldPassword     = new FormControl('', Validators.required);
    newPassword     = new FormControl('', Validators.required);
    newEmailAddress = new FormControl('', Validators.required);

    constructor(private formBuilder: FormBuilder,
                private userService: UserService) { }

    ngOnInit() {
        this.updateForm = this.formBuilder.group({
            oldPassword    : this.oldPassword,
            newPassword    : this.newPassword,
            newEmailAddress: this.newEmailAddress
        });

        this.userService.getProfileInfo().subscribe((res) => {
            if (res) {
                this.user = res;
                this.user.registeredAt = new Date(res.registeredAt + 'Z').toLocaleString();
                this.user.lastLoggedInAt = new Date(res.lastLoggedInAt + 'Z').toLocaleString();
            } else {
                // TODO: show error message.
            }
        });
    }

    update() {
        if (!this.updateForm.value.oldPassword) {
            UIkit.notification('Mevcut parolanız alanı boş bırakılamaz!', {
                status: 'danger',
                pos: 'bottom-right'
            });
        } else {
            this.userService.update(this.updateForm.value.oldPassword,
                                    this.updateForm.value.newPassword,
                                    this.updateForm.value.newEmailAddress)
            .subscribe((res) => {
                if (res.success) {
                    UIkit.notification('<span uk-icon="icon: check"></span> Güncelleme işlemi başarılı sonuçlandı!', {
                        status: 'success',
                        pos   : 'bottom-right'
                    });
                    window.location.reload();
                } else {
                    UIkit.notification('Eski parolanızı yanlış girdiniz.<br/>Lütfen doğru parolanız ile tekrar deneyiniz.', {
                        status: 'danger',
                        pos   : 'bottom-right'
                    });
                }
            });
        }
    }
}
