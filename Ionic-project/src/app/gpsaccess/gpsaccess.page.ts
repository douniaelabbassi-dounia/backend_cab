import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { presentToast } from '../utiles/component/notification';
// import { getGeolocalisation, position } from '../utiles/getLocalisation';

@Component({
  selector: 'app-gpsaccess',
  templateUrl: './gpsaccess.page.html',
  styleUrls: ['./gpsaccess.page.scss'],
})
export class GPSAccessPage implements OnInit {

  position:{lat:string, long:string} = {
    lat:'',
    long:''
  }

  getPossitionStatus:boolean = false
  constructor(private router:Router) {

  }

  ngOnInit() { }

  ionViewWillEnter(){
    this.fillPosition();
    this.checkPosition();

  }



  goMap(){
    this.router.navigate(["/map"])
  }

  checkPosition(){

    if( this.position.lat != '' && this.position.long !=  ''){
      this.goMap();
    }
  }

  getGeolocalisation(){
    console.log('start the get geolocalisation method');

    var onSuccess = async (position:any) => {
      console.log('starting on success');

      // alert('Latitude: '          + position.coords.latitude          + '\n' +
      //       'Longitude: '         + position.coords.longitude         + '\n' +
      //       'Altitude: '          + position.coords.altitude          + '\n' +
      //       'Accuracy: '          + position.coords.accuracy          + '\n' +
      //       'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
      //       'Heading: '           + position.coords.heading           + '\n' +
      //       'Speed: '             + position.coords.speed             + '\n' +
      //       'Timestamp: '         + position.timestamp                + '\n');

      localStorage.setItem('lat', position.coords.latitude)
      localStorage.setItem('long', position.coords.longitude)
      console.log("stocked data in local storage");

      this.position.lat = await localStorage.getItem('lat')!;
      this.position.long = await localStorage.getItem('long')!;


      // console.log("stocked data in position variable lat : "+this.position.lat+' long : '+ this.position.long);
      presentToast("stocked data in position variable lat : "+this.position.lat+' long : '+ this.position.long, 'bottom', 'success')

      if(this.position.lat != '' && this.position.long != ''){
        this.getPossitionStatus = true
        this.checkPosition();

      }
     console.log('end of onSuccess!');

  };

  // onError Callback receives a PositionError object
  //
  var onError = (error:any) => {
            presentToast('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n', 'bottom', 'danger')
  }

  console.log('start get current position method!');
    navigator.geolocation.getCurrentPosition(onSuccess, onError)
    console.log('end of get current position method !!!');

    if(this.getPossitionStatus){
      this.goMap();
      this.getPossitionStatus = false
    }

    // presentToast('the end of the process !!', 'bottom', 'danger')

  }

  fillPosition(){
    this.position.lat = localStorage.getItem('lat') || '';
    this.position.long = localStorage.getItem('long') || '';
  }

}
