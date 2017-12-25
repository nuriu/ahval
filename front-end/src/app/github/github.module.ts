import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { GitHubRoutingModule } from './github-routing.module';

import { GitHubComponent } from './components/github/github.component';
import { FlowItemComponent } from './components/flowItem/flowItem.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RepositoryComponent } from './components/repository/repository.component';
import { IssueComponent } from './components/issue/issue.component';

import { GitHubService } from './services/github.service';
import { WeeklyService } from '../weekly/services/weekly.service';



@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
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
        GitHubService,
        WeeklyService
    ]
})
export class GitHubModule { }
