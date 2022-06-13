import { Component, OnInit, Input } from '@angular/core';
import { Location } from '../models/location';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {
  @Input() name: string;

  text: string = "Initial Text";
  userLocation: Location = new Location();
  constructor() { }

  ngOnInit() {}

  onChangeText(){
    this.text = "Text Changed!"
  }

  askForGeolocationPermission() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((data) => {
        this.userLocation.latitude = data.coords.latitude;
        this.userLocation.longitude = data.coords.longitude;
      },
      (error) => {},
      {enableHighAccuracy: true,
      timeout: 5000,
    maximumAge: 10000});
    }
  }

}
