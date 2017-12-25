import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WeeklyComponent } from './components/weekly/weekly.component';



const weeklyRoutes: Routes = [
    { path: 'home', component: WeeklyComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(weeklyRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class WeeklyRoutingModule { }
