import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { WeeklyRoutingModule } from './weekly-routing.module';

import { WeeklyComponent } from './components/weekly/weekly.component';

import { WeeklyService } from './services/weekly.service';



@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        WeeklyRoutingModule
    ],
    declarations: [
        WeeklyComponent
    ],
    providers: [
        WeeklyService
    ]
})
export class WeeklyModule { }
