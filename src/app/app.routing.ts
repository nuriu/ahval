import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { GitHubComponent } from "./github/github.component";
import { GitLabComponent } from "./gitlab/gitlab.component";
import { BitbucketComponent } from "./bitbucket/bitbucket.component";
import { TrelloComponent } from "./trello/trello.component";

/**
 * App routes.
 */
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
