import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GitHubComponent } from './components/github/github.component';

const githubRoutes: Routes = [
    { path: 'home', component: GitHubComponent }
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
