
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FileSelectDirective } from 'ng2-file-upload';
import { FormsModule,ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AlertComponent } from './_directives';
import { AuthGuard } from './_guards';
import { JwtInterceptor } from './_helpers';
import { AlertService, AuthenticationService, UserService, CommonService } from './_services';
import { LoginComponent } from './login';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { CreateCaseComponent } from './create-case/create-case.component';
import { CasesComponent } from './cases/cases.component';
import { MapComponent } from './map/map.component';
// import { FilterPipeModule } from 'ngx-filter-pipe';
// import { CookieService } from 'ngx-cookie-service';

import { AgmCoreModule } from '@agm/core';
import { Error404Component } from './error404/error404.component';
import { CsvUploaderComponent } from './csv-uploader/csv-uploader.component';

@NgModule({
  imports: [
        FormsModule,
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        NgxSpinnerModule,
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
      AgmCoreModule.forRoot({
          apiKey: 'AIzaSyCJo4u2hiqPKQbmW-2Hnd3ckPHBfyrHI7E&libraries=drawing,places,visualization'
      })
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    CreateCaseComponent,
    CasesComponent,
    MapComponent,
    Error404Component,
    CsvUploaderComponent,
    FileSelectDirective

  ],
  providers: [
      AuthGuard,
    // CookieService,
      AlertService,
      AuthenticationService,
      CommonService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },

    // provider used to create fake backend
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }