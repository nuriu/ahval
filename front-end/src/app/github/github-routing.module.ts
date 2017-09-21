import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GitHubComponent } from './components/github/github.component';
import { ProfileComponent } from './components/profile/profile.component';

const githubRoutes: Routes = [
    { path: 'home', component: GitHubComponent },
    { path: 'profile', component: ProfileComponent }
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
