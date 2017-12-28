import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../../services/user.service';
import { GitLabService } from '../../services/gitlab.service';

import * as $ from 'jquery';
import * as UIkit from 'uikit';



@Component({
    selector: 'app-gitlab-repository',
    templateUrl: './repository.component.html',
    styleUrls: ['./repository.component.css']
})
export class RepositoryComponent implements OnInit {
    @Input() repo;
    @Input() commits;
    @Input() issues;

    constructor(private gitlabService: GitLabService,
                private userService: UserService,
                private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.userService.getToken('GITLAB').subscribe((res) => {
                if (res['token']) {
                    this.gitlabService.setToken(res['token']);

                    if (params.owner != null && params.name != null) {
                        this.gitlabService.getProject(params.owner, params.name)
                        .subscribe((data) => {
                            this.repo = data;
                            this.repo.created_at = new Date(this.repo.created_at);
                            this.repo.last_activity_at = new Date(this.repo.last_activity_at);

                            this.getCommits();

                            // console.log(this.repo);
                        });
                    }
                } else {
                    console.log('Error: Could not get gitlab access token of user.');
                }
            });
        });
    }

    getCommits() {
        this.gitlabService.getProjectCommits(this.repo.owner.username, this.repo.name)
        .subscribe((data) => {
            this.commits = data;

            this.commits.forEach(c => {
                c.committed_date = new Date(c.committed_date);
                c.authored_date  = new Date(c.authored_date);
                c.created_at     = new Date(c.created_at);
            });

            this.getIssues();

            // console.log(this.commits);
        });
    }

    getIssues() {
        this.gitlabService.getProjectIssues(this.repo.owner.username, this.repo.name)
        .subscribe((data) => {
            this.issues = data;
            // console.log(this.issues);
        });
    }

    createIssue() {
        const title = $('#issueForm #issueTitle');
        const body = $('#issueForm #issueBody');

        if (title.val().toString().trim() !== '') {
            this.gitlabService.createProjectIssue(this.repo.owner.username, this.repo.name, title.val().toString(), body.val().toString())
            .subscribe((data) => {
                if (data != null) {
                    window.location.reload();
                }
            });
        } else {
            UIkit.notification('Başlıksız iş oluşturulamaz!', {
                status: 'danger',
                pos: 'top-center'
            });
        }
    }
}
