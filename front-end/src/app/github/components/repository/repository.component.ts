import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../../services/user.service';
import { GitHubService } from '../../services/github.service';

@Component({
    selector: 'app-github-repository',
    templateUrl: './repository.component.html',
    styleUrls: ['./repository.component.css']
})
export class RepositoryComponent implements OnInit {
    @Input() repo;
    @Input() commits;

    constructor(private githubService: GitHubService,
                private userService: UserService,
                private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.userService.getToken('GITHUB').subscribe((res) => {
                if (res.token) {
                    this.githubService.setToken(res.token);
                    this.githubService.activate();

                    if (params.owner != null && params.name != null) {
                        this.githubService.getRepoInfo(params.owner, params.name)
                        .subscribe((data) => {
                            this.repo = data;
                            this.repo.created_at = new Date(this.repo.created_at);
                            this.repo.updated_at = new Date(this.repo.updated_at);

                            console.log(this.repo);
                            this.getCommits();
                        });
                    }
                } else {
                    console.log('Error: Could not get github access token of user.');
                }
            });
        });
    }

    getCommits() {
        this.githubService.getCommits(this.repo.owner.login, this.repo.name)
        .subscribe((data) => {
            this.commits = data;
            this.commits.forEach(c => {
                c.commit.author.date = new Date(c.commit.author.date);
            });
            console.log(this.commits);
        });
    }
}
