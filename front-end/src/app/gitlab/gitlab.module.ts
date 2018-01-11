import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { GitLabRoutingModule } from './gitlab-routing.module';

import { GitLabComponent } from './components/gitlab/gitlab.component';
import { ProfileComponent } from './components/profile/profile.component';
import { GroupComponent } from './components/group/group.component';
import { RepositoryComponent } from './components/repository/repository.component';
import { IssueComponent } from './components/issue/issue.component';

import { GitLabService } from './services/gitlab.service';
import { WeeklyService } from '../weekly/services/weekly.service';



@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        GitLabRoutingModule
    ],
    declarations: [
        GitLabComponent,
        ProfileComponent,
        GroupComponent,
        RepositoryComponent,
        IssueComponent
    ],
    providers: [
        GitLabService,
        WeeklyService
    ]
})
export class GitLabModule { }
