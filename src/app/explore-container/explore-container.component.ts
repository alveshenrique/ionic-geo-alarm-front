import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Location } from '../models/location';

// Use your API_KEY instead of this variable to run this project
import { API_KEY } from '../../environments/env.keys'

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {
  @Input() name: string;
  apiLoaded: Observable<boolean> = new Observable<boolean>();
  
  // Maps marker configs
  center: google.maps.LatLngLiteral;
  zoom: number = 15;
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions: google.maps.LatLngLiteral[] = [];

  // Other configs
  text: string = "Initial Text";
  userLocation: Location = new Location();
  constructor(private geolocation: Geolocation,
    private httpClient: HttpClient) { 
      this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=' + API_KEY, 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
    }

  ngOnInit() {}

  askForGeolocationPermission() {
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition((data) => {
    //     this.userLocation.latitude = data.coords.latitude;
    //     this.userLocation.longitude = data.coords.longitude;
    //   },
    //   (error) => {},
    //   {enableHighAccuracy: true,
    //   timeout: 5000,
    // maximumAge: 10000});
    // }
    if(this.geolocation) {
      this.geolocation.getCurrentPosition().then(
        (r) => {
          this.userLocation.latitude = r.coords.latitude;
          this.userLocation.longitude = r.coords.longitude;
          this.placeMarker();
        }
      ).catch(
        (e) => console.log("Error when getting location: ", e)
      )
    }
    }

    private placeMarker() {
      this.center = {lat: this.userLocation.latitude, lng: this.userLocation.longitude};
      this.markerPositions = [{lat: this.userLocation.latitude, lng: this.userLocation.longitude}];
    }

}
