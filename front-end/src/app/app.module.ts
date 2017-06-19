import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// TODO: Search alternatives.
import { MomentModule } from 'angular2-moment';

import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { GitHubComponent } from './components/github/github.component';

import { UserGuard } from './guards/user.guard';

import { GitHubService } from './services/github.service';
import { UserService } from './services/user.service';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        ProfileComponent,
        SidebarComponent,
        GitHubComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        MomentModule,
        RouterModule.forRoot([
            { path: '', component         : LoginComponent, pathMatch      : 'full' },
            { path: 'login', component    : LoginComponent },
            { path: 'register', component : RegisterComponent },
            { path: 'home', component     : HomeComponent, canActivate    : [UserGuard] },
            { path: 'profile', component  : ProfileComponent, canActivate : [UserGuard] },
            { path: "github", component   : GitHubComponent, canActivate  : [UserGuard] },
            { path: '**', redirectTo      : 'home' }
        ])
    ],
    providers: [
        UserService,
        UserGuard,
        GitHubService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
