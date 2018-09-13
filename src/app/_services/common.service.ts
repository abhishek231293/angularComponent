/**
 * Created by S@ndy on 31/5/18.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
// import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class CommonService {

    API_URL = environment.apiUrl;
    url: string;
    constructor(private _http: HttpClient) {
        // this.url  = 'https://api.datamuse.com/words?ml=';
    }

    /*getBranches(param): Observable<{}> {
        // const header        = new HttpHeaders();
        // const other_header  = header.append('Authorization', 'Bearer' + param.token);
        // return this._http.post<{}>(this.API_URL + '/list', '', {headers : other_header});
        return this._http.get<{}>(this.API_URL + '/list');
    }*/

    /*getRequestCreator(param, route, token): Observable<{}> {
        /!*console.log(param);
        console.log(route);
        console.log(token);*!/
        const header        = new HttpHeaders();
        const other_header  = header.append('Authorization', 'Bearer' + token);
        return this._http.get<{}>(this.API_URL + '/' + route, param, {headers : other_header});
    }*/

    postRequestCreator(param, route, token): Observable<{}> {
        // console.log(param);
        // console.log(route);
        // console.log(token);
        const header        = new HttpHeaders();
        const other_header  = header.append('Authorization', 'Bearer' + token);
        return this._http.post<{}>(this.API_URL + '/' + route, param, {headers : other_header});
    }

    postRequestNoTokenCreator(param, route): Observable<{}> {
        // console.log(param);
        // console.log(route);
        // console.log(token);

        return this._http.post<{}>(this.API_URL + '/' + route, param);
    }

    getBranchDetailById(param, route, token): Observable<{}> {
        const header        = new HttpHeaders();
        const other_header  = header.append('Authorization', 'Bearer' + param.token);
        return this._http.post<{}>(this.API_URL + '/'+route, '', {headers : other_header});
    }
    /*upload(fileToUpload: any) {
        let input = new FormData();
        input.append("file", fileToUpload);

        return this.http.post("/api/uploadFile", input);
    }*/
    postFile(fileToUpload: File, userId, token): Observable<{}> {
        const header        = new HttpHeaders();
        const other_header  = header.append('Authorization', 'Bearer' + token);
        const endpoint = this.API_URL+'/upload-pic';
        const formData: FormData = new FormData();
        formData.append('fileKey', fileToUpload, fileToUpload.name);
        formData.append('userId', userId);
        return this._http
            .post(endpoint, formData, { headers: other_header })
    }

    getRoleDetails(param,token): Observable<{}> {
        const route         = 'role-detail';
        const header        = new HttpHeaders();
        const other_header  = header.append('Authorization', 'Bearer' + token);
        return this._http.post<{}>(this.API_URL + '/' + route, param, {headers : other_header});
    }

    getDepartmentDetails(param,token): Observable<{}> {
        const route         = 'department-detail';
        const header        = new HttpHeaders();
        const other_header  = header.append('Authorization', 'Bearer' + token);
        return this._http.post<{}>(this.API_URL + '/' + route, param, {headers : other_header});
    }
}
