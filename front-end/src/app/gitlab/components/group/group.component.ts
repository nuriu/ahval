import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../../services/user.service';
import { GitLabService } from '../../services/gitlab.service';

@Component({
    selector: 'app-gitlab-group',
    templateUrl: './group.component.html',
    styleUrls  : ['./group.component.css']
})
export class GroupComponent implements OnInit {
    @Input() group;
    @Input() members;
    @Input() repos;

    constructor(private gitlabService: GitLabService,
                private userService  : UserService,
                private route        : ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.userService.getToken('GITLAB').subscribe(res => {
                if (res['token']) {
                    this.gitlabService.setToken(res['token']);

                    this.getGroup(params.name);
                } else {
                    console.log('Error: Could not get gitlab access token of user.');
                }
            });
        });
    }

    getGroup(name: string) {
        this.gitlabService.getGroupInfo(name).subscribe(
            data  => this.group = data,
            error => console.log(error),
            ()    => {
                // console.log(this.group);
                this.getGroupMembers();
            }
        )
    }

    getGroupMembers() {
        this.gitlabService.getGroupMembers(this.group.path).subscribe(
            data  => this.members = data,
            error => console.log(error),
            ()    => {
                // console.log(this.members);
                this.getGroupProjects();
            }
        )
    }

    getGroupProjects() {
        this.repos = this.group.projects;
        // this.gitlabService.getGroupProjects(this.group.path).subscribe(
        //     data  => this.repos = data,
        //     error => console.log(error),
        //     ()    => {
        //         // console.log(this.repos);
        //     }
        // )
    }
}
