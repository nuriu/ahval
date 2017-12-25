import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GitHubComponent } from './components/github/github.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RepositoryComponent } from './components/repository/repository.component';
import { IssueComponent } from './components/issue/issue.component';



const githubRoutes: Routes = [
    { path: 'home', component: GitHubComponent },
    { path: 'profile/:login', component: ProfileComponent },
    { path: 'repository/:owner/:name', component: RepositoryComponent },
    { path: 'issue/:owner/:name/:number', component: IssueComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(githubRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class GitHubRoutingModule { }
