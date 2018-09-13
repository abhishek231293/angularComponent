/**
 * Created by S@ndy on 28/5/18.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
// import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './login';
// import { BranchComponent } from './branch/branch.component';
import { AuthGuard } from './_guards';
import {CreateCaseComponent} from './create-case/create-case.component';
import {CasesComponent} from "./cases/cases.component";
import {MapComponent} from "./map/map.component";
import {Error404Component} from "./error404/error404.component";
import {CsvUploaderComponent} from "./csv-uploader/csv-uploader.component";


const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'create-case',
        component: CreateCaseComponent
    },
    {
        path: 'upload-csv',
        component: CsvUploaderComponent
    },
    {
        path: 'map',
        component: MapComponent
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'cases',
        component: CasesComponent
    },
    {
        path: '404-error',
        component: Error404Component
    },
    // otherwise redirect to login
    {
        path: '**',
        redirectTo: '404-error'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

// export const routing = RouterModule.forRoot(routes);
export class routing {}