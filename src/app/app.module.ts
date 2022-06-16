import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AutoCompleteModule } from 'ionic4-auto-complete';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    HttpClientJsonpModule,
    GoogleMapsModule,
    AutoCompleteModule],
  providers: [{ 
    provide: RouteReuseStrategy,
    useClass: IonicRouteStrategy },
    Geolocation,
    Vibration],
  bootstrap: [AppComponent],
})
export class AppModule { }
