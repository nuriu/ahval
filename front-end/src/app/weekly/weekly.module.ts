import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { WeeklyRoutingModule } from './weekly-routing.module';

import { WeeklyComponent } from './components/weekly/weekly.component';

import { WeeklyService } from './services/weekly.service';



@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
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
