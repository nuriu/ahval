import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { UserGuard } from './guards/user.guard';
import { GitHubGuard } from './guards/github.guard';

import { UserService } from './services/user.service';



@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        ProfileComponent,
        SidebarComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule
    ],
    providers: [
        UserService,
        UserGuard,
        GitHubGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
