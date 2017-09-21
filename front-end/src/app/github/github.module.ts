import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { GitHubRoutingModule } from './github-routing.module';

import { GitHubComponent } from './components/github/github.component';
import { FlowItemCardComponent } from './components/flowItemCard/flowItemCard.component';
import { ProfileComponent } from './components/profile/profile.component';

import { GitHubService } from './services/github.service';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        GitHubRoutingModule
    ],
    declarations: [
        GitHubComponent,
        FlowItemCardComponent,
        ProfileComponent
    ],
    providers: [
        GitHubService
    ]
})
export class GitHubModule { }
