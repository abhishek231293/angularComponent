import {Component, OnInit, NgZone, ElementRef, Input} from '@angular/core';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import {environment} from '../../environments/environment';
import {DomSanitizer} from "@angular/platform-browser";


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input() projectId: string;

  public apiBaseUrl: string        = environment.apiBaseUrl;
  public iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiBaseUrl+'/storiesmap');

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private hostElement: ElementRef, private sanitizer: DomSanitizer) { }

  ngOnInit() {
     this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiBaseUrl+'/storiesmap?formid='+this.projectId);
    // this.iframeUrl = 'http://localhost:4200/storiesmap';
    // this.iframeUrl = 'http://ardmng.4c360.solutions/admin/storiesmap';
  }


}
