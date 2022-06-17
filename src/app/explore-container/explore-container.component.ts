import { Component, OnInit, Input, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
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
  
  // Autocomplete settings
  GoogleAutocomplete: google.maps.places.AutocompleteService;
  autocomplete: { input: string; };
  autocompleteItems: any[];

  // Other configs
  userLocation: Location = new Location();

  // For testing
  userPosition: google.maps.LatLng;
  searchPosition: google.maps.LatLng;
  distance;

  constructor(private geolocation: Geolocation,
    private httpClient: HttpClient,
    public zone: NgZone,
    private vibration: Vibration) { 
      this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=' + API_KEY + '&v=3.exp&libraries=places,geometry', 'callback')
      .pipe(
        map(() => {
            this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
            this.askForGeolocationPermission();
            return true;}),
          catchError(() => of(false)),
        );
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    }

  ngOnInit() {}

  askForGeolocationPermission() {
    if(this.geolocation) {
      this.geolocation.getCurrentPosition().then(
        (r) => {
          this.userLocation.latitude = r.coords.latitude;
          this.userLocation.longitude = r.coords.longitude;
          this.userPosition = new google.maps.LatLng(r.coords.latitude, r.coords.longitude);
          this.placeMarker();
          this.getGeocodingByLatLng(this.center);
        }
      ).catch(
        (e) => console.log("Error when getting location: ", e)
      )
    }
    }

    getGeocodingByHttp(place: string) {
      this.httpClient.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + place + "&key=" + API_KEY).subscribe({
        next: (result : {'results': [{'geometry': {'location': {'lat': number, 'lng': number}}}]}) => {
          console.log(result.results[0].geometry.location);
          this.userLocation.latitude = result.results[0].geometry.location.lat;
          this.userLocation.longitude = result.results[0].geometry.location.lng;
        },
        error: (error) => console.log(error)
      });
    }

    getGeocodingByPlaceId(placeId: string) {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({'placeId' : placeId}, results => {
        let userLatLng = results[0].geometry.location;
        this.userLocation.latitude = userLatLng.toJSON().lat;
        this.userLocation.longitude = userLatLng.toJSON().lng;
        this.placeMarker();
      })
    }

    getGeocodingByAddress(address: string) {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({'address' : address}, results => {
        console.log(results);
      })
    }

    getGeocodingByLatLng(latlng: google.maps.LatLngLiteral) {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({'location' : latlng}, results => {
        // console.log('Results from geocoding the latlng from the gps:')
        // console.log(results[0].formatted_address);
        this.autocomplete.input = results[0].formatted_address;
      })
    }

    private placeMarker() {
      this.center = {lat: this.userLocation.latitude, lng: this.userLocation.longitude};
      this.searchPosition = new google.maps.LatLng(this.center);
      this.markerPositions = [{lat: this.userLocation.latitude, lng: this.userLocation.longitude}];
      this.distance = google.maps.geometry.spherical.computeDistanceBetween(this.searchPosition, this.userPosition);
    }

    updateSearchResults(){
      if (this.autocomplete.input == '') {
        this.autocompleteItems = [];
        return;
      }
      this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions: google.maps.places.AutocompletePrediction[], status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction: google.maps.places.AutocompletePrediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      });
    }

    selectSearchResult(item: google.maps.places.AutocompletePrediction) {
      this.autocomplete.input = item.description;
      this.autocompleteItems = [];
      this.getGeocodingByPlaceId(item.place_id);
      
    }

    // showCurrentSelectedPosition() {
    //   console.log(this.userLocation);
    // }

    vibrate() {
      this.vibration.vibrate([2000,1000,2000]);
      console.log("Vibrating... brrr");
    }
}
