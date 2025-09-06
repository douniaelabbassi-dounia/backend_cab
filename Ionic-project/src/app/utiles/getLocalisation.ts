import { Router } from "@angular/router";

export let position:{lat:string, long:string} = {
    lat: '',
    long: ''
};

const router = new Router();
const goMap = () => {
    router.navigate(['/map']);
} 

export const getGeolocalisation = () => {

    var onSuccess = (position:any) => {
      // alert('Latitude: '          + position.coords.latitude          + '\n' +
      //       'Longitude: '         + position.coords.longitude         + '\n' +
      //       'Altitude: '          + position.coords.altitude          + '\n' +
      //       'Accuracy: '          + position.coords.accuracy          + '\n' +
      //       'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
      //       'Heading: '           + position.coords.heading           + '\n' +
      //       'Speed: '             + position.coords.speed             + '\n' +
      //       'Timestamp: '         + position.timestamp                + '\n');

      localStorage.setItem('lat', position.coords.latitude);
      localStorage.setItem('long', position.coords.longitude);
    //   position.let = await localStorage.getItem('lat');
    //   position.long = await localStorage.getItem('long');
      goMap();
  };

  // onError Callback receives a PositionError object
  //
  var onError = (error:any) => {
      // alert('code: '    + error.code    + '\n' +
      //       'message: ' + error.message + '\n');
  }
    navigator.geolocation.getCurrentPosition(onSuccess, onError)
  }