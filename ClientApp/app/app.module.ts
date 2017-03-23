import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UniversalModule } from 'angular2-universal';
import { MomentModule } from 'angular2-moment';
import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { GitHubComponent } from './components/github/github.component';
import { GitLabComponent } from './components/gitlab/gitlab.component';
import { BitbucketComponent } from './components/bitbucket/bitbucket.component';
import { TrelloComponent } from './components/trello/trello.component';

import { UserGuard } from './guards/user.guard';

import { GitHubService } from './services/github.service';
import { UserService } from './services/user.service';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        ProfileComponent,
        SidebarComponent,
        AvatarComponent,
        GitHubComponent,
        GitLabComponent,
        BitbucketComponent,
        TrelloComponent
    ],
    providers: [
        UserService,
        UserGuard,
        GitHubService
    ],
    imports: [
        UniversalModule, // Imports BrowserModule, HttpModule, and JsonpModule too.
        FormsModule,
        ReactiveFormsModule,
        MomentModule,
        RouterModule.forRoot([
            { path: '', component         : LoginComponent, pathMatch      : 'full' },
            { path: 'login', component    : LoginComponent },
            { path: 'home', component     : HomeComponent, canActivate     : [UserGuard] },
            { path: 'profile', component  : ProfileComponent, canActivate  : [UserGuard] },
            { path: "github", component   : GitHubComponent, canActivate   : [UserGuard] },
            { path: "gitlab", component   : GitLabComponent, canActivate   : [UserGuard] },
            { path: "bitbucket", component: BitbucketComponent, canActivate: [UserGuard] },
            { path: "trello", component   : TrelloComponent, canActivate   : [UserGuard] },
            { path: '**', redirectTo      : 'home' }
        ])
    ]
})
export class AppModule {}
