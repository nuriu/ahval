import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UniversalModule } from 'angular2-universal';
import { MomentModule } from 'angular2-moment';
import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { GitHubComponent } from "./components/github/github.component";
import { GitLabComponent } from "./components/gitlab/gitlab.component";
import { BitbucketComponent } from "./components/bitbucket/bitbucket.component";
import { TrelloComponent } from "./components/trello/trello.component";

import { GitHubService } from './services/github.service';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        HomeComponent,
        SidebarComponent,
        AvatarComponent,
        GitHubComponent,
        GitLabComponent,
        BitbucketComponent,
        TrelloComponent
    ],
    providers: [
        GitHubService
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        FormsModule,
        ReactiveFormsModule,
        MomentModule,
        RouterModule.forRoot([
            { path: '', redirectTo        : 'home', pathMatch: 'full' },
            { path: 'home', component     : HomeComponent },
            { path: "github", component   : GitHubComponent },
            { path: "gitlab", component   : GitLabComponent },
            { path: "bitbucket", component: BitbucketComponent },
            { path: "trello", component   : TrelloComponent },
            { path: '**', redirectTo      : 'home' }
        ])
    ]
})
export class AppModule {}
