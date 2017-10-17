import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { GitHubRoutingModule } from './github-routing.module';

import { GitHubComponent } from './components/github/github.component';
import { FlowItemComponent } from './components/flowItem/flowItem.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RepositoryComponent } from './components/repository/repository.component';
import { IssueComponent } from './components/issue/issue.component';

import { GitHubService } from './services/github.service';



@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        GitHubRoutingModule
    ],
    declarations: [
        GitHubComponent,
        FlowItemComponent,
        ProfileComponent,
        RepositoryComponent,
        IssueComponent
    ],
    providers: [
        GitHubService
    ]
})
export class GitHubModule { }
