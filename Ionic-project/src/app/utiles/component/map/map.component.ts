import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent  implements OnInit {
  
  map:any;
  markers:google.maps.Marker[] = []
  input:any;
 
  constructor() { }

  ngOnInit() {
    this.initAutocomplete();
  }

  
  check(event: google.maps.MapMouseEvent){
    console.log("hello from check methos");
    console.log(event);
    
    // console.log('Latitude: ', event?.latLng?.lat());
    // console.log('Longitude: ', event?.latLng?.lng());
  }

  checkMarkerPlacement(event: any) {
    console.log(event);
    
    // Extract coordinates or other relevant event data
    const lat = event.detail?.clientX; // Replace with appropriate property
    const lng = event.detail?.clientY; // Replace with appropriate property

   console.log(lat); // Replace with appropriate property
   console.log(lng); // Replace with appropriate property

    // Add marker logic using your map library (e.g., Google Maps, Leaflet)
    this.map.addMarker({ lat, lng });
  }

  

  initAutocomplete() {
    this.map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: { lat: -33.8688, lng: 151.2195 },
        zoom: 13,
        mapTypeId: "roadmap",
      }
    );
  
    // Create the search box and link it to the UI element.
    this.input = document.getElementById("pac-input") as HTMLInputElement;
    const searchBox = new google.maps.places.SearchBox(this.input);
  
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.input);
  
    // Bias the SearchBox results towards current map's viewport.
    this.map.addListener("bounds_changed", () => {
      searchBox.setBounds(this.map.getBounds() as google.maps.LatLngBounds);
    });

  
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
  
      if (places?.length == 0) {
        return;
      }
  
      // Clear out the old markers.
      this.markers.forEach((marker) => {
        marker.setMap(null);
      });
      this.markers = [];
  
      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
  
      places?.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }
  
        const icon = {
          url: place.icon as string,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };
  
        // Create a marker for each place.
        this.markers.push(
          new google.maps.Marker({
            map: this.map,
            icon,
            title: place.name,
            position: place.geometry.location,
          })
        );
  
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.map.fitBounds(bounds);
    });
  }
  
  // declare global {
  //   interface Window {
  //     initAutocomplete: () => void;
  //   }
  // }
  // window.initAutocomplete = initAutocomplete;

}
