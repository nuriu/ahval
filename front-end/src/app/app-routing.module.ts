import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { UserGuard } from './guards/user.guard';
import { GitHubGuard } from './guards/github.guard';

const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch     : 'full' },
  { path: 'login', component    : LoginComponent },
  { path: 'register', component : RegisterComponent },
  { path: 'home', component     : HomeComponent, canActivate    : [UserGuard] },
  { path: 'profile', component  : ProfileComponent, canActivate : [UserGuard] },
  { path: 'github', loadChildren: './github/github.module#GitHubModule', canLoad: [GitHubGuard] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
