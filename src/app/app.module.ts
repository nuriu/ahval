import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";

import { MomentModule } from "angular2-moment";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { GitHubComponent } from "./github/github.component";
import { GitLabComponent } from "./gitlab/gitlab.component";
import { BitbucketComponent } from "./bitbucket/bitbucket.component";
import { TrelloComponent } from "./trello/trello.component";

import { SidebarComponent } from "./shared/sidebar/sidebar.component";
import { AvatarComponent } from "./shared/avatar/avatar.component";
import { ToastComponent } from "./shared/toast/toast.component";

import { GitHubService } from "./services/github.service";

import { routing, appRoutingProviders } from "./app.routing";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    GitHubComponent,
    GitLabComponent,
    BitbucketComponent,
    TrelloComponent,
    SidebarComponent,
    AvatarComponent,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MomentModule,
    routing
  ],
  providers: [
    appRoutingProviders,
    GitHubService,
    ToastComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
