import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GitLabComponent } from './components/gitlab/gitlab.component';
import { ProfileComponent } from './components/profile/profile.component';
import { GroupComponent } from './components/group/group.component'
import { RepositoryComponent } from './components/repository/repository.component';
import { IssueComponent } from './components/issue/issue.component';



const gitlabRoutes: Routes = [
    { path: 'home', component: GitLabComponent },
    { path: 'profile/:login', component: ProfileComponent },
    { path: 'group/:name', component: GroupComponent },
    { path: 'repository/:owner/:name', component: RepositoryComponent },
    { path: 'issue/:owner/:name/:number', component: IssueComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(gitlabRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class GitLabRoutingModule { }
