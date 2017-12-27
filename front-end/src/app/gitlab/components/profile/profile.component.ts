import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../../services/user.service';
import { GitLabService } from '../../services/gitlab.service';

@Component({
    selector: 'app-gitlab-profile',
    templateUrl: './profile.component.html',
    styleUrls  : ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    @Input() user;
    @Input() repos;

    constructor(private gitlabService: GitLabService,
                private userService  : UserService,
                private route        : ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.userService.getToken('GITLAB').subscribe(res => {
                if (res['token']) {
                    this.gitlabService.setToken(res['token']);

                    this.getUser(params.login);
                } else {
                    console.log('Error: Could not get gitlab access token of user.');
                }
            });
        });
    }

    getUser(login?: string) {
        if (login != null) {
            this.gitlabService.getUserInfo(login).subscribe((data: any) => {
                this.gitlabService.getUserDataWithId(data[0].id).subscribe(u => {
                    this.user = u;
                    // console.log(this.user);

                    if (this.user.website_url !== '' && this.user.website_url != null) {
                        const pattern = /^((http|https):\/\/)/;

                        if (!pattern.test(this.user.website_url)) {
                            this.user.website_url = 'http://' + this.user.website_url;
                        }
                    }

                    this.getRepos();
                });
            });
        } else {
            this.gitlabService.getUser().subscribe(
                data  => this.user = data,
                error => console.log(error),
                ()    => {
                    this.getRepos();
                }
            );
        }
    }

    getRepos() {
        this.gitlabService.getUserRepos(this.user.username).subscribe(
            data  => this.repos = data,
            error => console.log(error),
            ()    => {
                // console.log(this.repos);
            }
        );
    }
}
