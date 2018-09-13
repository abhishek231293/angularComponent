import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  constructor(private http: HttpClient) {

  }

  public getUserActivityJSON(): Observable<any> {
    return this.http.get("./assets/json/userActivity.json")
  }

  public getProjectUpdateJSON(): Observable<any> {
    return this.http.get("./assets/json/projectUpdate.json")
  }

  public getUserProjectsJSON(): Observable<any> {
    return this.http.get("./assets/json/userProjects.json")
  }

}
