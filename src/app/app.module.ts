import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home.component';

import { routing, appRoutingProviders } from './app.routing';

@NgModule({
  imports: [ BrowserModule, HttpModule, FormsModule, ReactiveFormsModule, routing ],
  declarations: [ AppComponent, HomeComponent ],
  bootstrap:    [ AppComponent ],
  providers:    [ appRoutingProviders ]
})
export class AppModule { }
