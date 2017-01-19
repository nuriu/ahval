import { NgModule }      from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { Http } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { AppComponent } from "./app.component";
import { SidebarComponent } from "./components/sidebar.component";
import { HomeComponent } from "./components/home.component";

import { routing, appRoutingProviders } from "./app.routing";

@NgModule({
    imports: [ BrowserModule, HttpModule, FormsModule, ReactiveFormsModule, routing ],
    declarations: [ AppComponent, SidebarComponent, HomeComponent ],
    bootstrap:    [ AppComponent ],
    providers:    [ appRoutingProviders ]
})

export class AppModule { }
