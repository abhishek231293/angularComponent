import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { User } from '../_models/user';
import { environment } from '../../environments/environment';
// import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthenticationService {
    API_URL = environment.apiUrl;
    url: string;
    constructor(private _http: HttpClient) {
        this.url  = 'https://api.datamuse.com/words?ml=';
    }

    userLogin(login) {        
        const data = {email: btoa(login.name) , password: btoa(login.password)};
        // const reqHeader = new HttpHeaders({'Content-Type': 'application/x-www-urlencodeed'});       
        return this._http.post(this.API_URL + '/login', data);
    }

    getUserData(param): Observable<{}> {
        const header        = new HttpHeaders();
        const other_header  = header.append('Authorization', 'Bearer' + param.token);
        return this._http.post<{}>(this.API_URL + '/user', '', {headers : other_header});
    }

    // logout() {
    //     // remove user from local storage to log user out
    //     localStorage.removeItem('userData');
    // }
}