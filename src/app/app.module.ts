import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { Http } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { MomentModule } from "angular2-moment";

import { AppComponent } from "./app.component";
import { SidebarComponent } from "./components/sidebar.component";
import { HomeComponent } from "./components/home.component";
import { AvatarComponent } from "./components/avatar.component";
import { GitHubComponent } from "./components/github.component";
import { GitLabComponent } from "./components/gitlab.component";
import { BitbucketComponent } from "./components/bitbucket.component";
import { TrelloComponent } from "./components/trello.component";

import { GitHubService } from "./services/github.service";

import { routing, appRoutingProviders } from "./app.routing";

/**
 * Default app module.
 */
@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        MomentModule,
        routing
    ],
    declarations: [
        AppComponent,
        SidebarComponent,
        HomeComponent,
        AvatarComponent,
        GitHubComponent,
        GitLabComponent,
        BitbucketComponent,
        TrelloComponent
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        appRoutingProviders,
        GitHubService
    ]
})
export class AppModule { }
