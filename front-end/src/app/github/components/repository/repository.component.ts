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
                        });
                    }
                } else {
                    console.log('Error: Could not get github access token of user.');
                }
            });
        });
    }
}
