import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./components/home.component";
import { GitHubComponent } from "./components/github.component";
import { GitLabComponent } from "./components/gitlab.component";
import { BitbucketComponent } from "./components/bitbucket.component";
import { TrelloComponent } from "./components/trello.component";

export const appRoutes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "github", component: GitHubComponent },
    { path: "gitlab", component: GitLabComponent },
    { path: "bitbucket", component: BitbucketComponent },
    { path: "trello", component: TrelloComponent }
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });
