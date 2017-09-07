import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { GitHubRoutingModule } from './github-routing.module';

import { GitHubComponent } from './github/github.component';

import { GitHubService } from './services/github.service';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        GitHubRoutingModule
    ],
    declarations: [
        GitHubComponent
    ],
    providers: [
        GitHubService
    ]
})
export class GitHubModule { }
