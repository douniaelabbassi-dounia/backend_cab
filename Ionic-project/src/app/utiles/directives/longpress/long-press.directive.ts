import { Directive, ElementRef, Output, AfterViewInit, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { GestureController } from '@ionic/angular';
import { ListPointsService } from '../../services/points/list-points.service';
import mapboxgl from 'mapbox-gl';

@Directive({
  selector: '[longPress]'
})
export class LongPressDirective implements AfterViewInit{

  @Output() latlng = new EventEmitter();
  @Output() eventListenerDetected = new EventEmitter();
  @Output() executeLongClick = new EventEmitter();
  @Input() mapEventDirective!:mapboxgl.Map ;
  @Input() checker!:boolean;
  private active:boolean = false;
  private marker:mapboxgl.Marker | null = null;
  timer: any;
  markers:mapboxgl.Marker[] = [];
  eventListener:any;
  private isLongPress: boolean = false;

  constructor(
    private el: ElementRef,
    private getstureCtrl: GestureController,
    private pointService: ListPointsService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['checker']) {
      console.log('Checker value changed:', this.checker);
    }
  }

  ngAfterViewInit(): void {
    this.initGesture();
  }

  initGesture(){
    let gesture = this.getstureCtrl.create({
      el: this.el.nativeElement,
      gestureName: 'long-press',
      threshold: 0,
      onStart: () =>{
        this.active = true;
        this.isLongPress = false;
        if(this.marker != null){
          console.log('clear marker runing now!');
          console.log(this.markers);
          if(this.markers.length > 0){
            this.clearMarkers();
            this.markers = []
            console.log('list markers is got empty !');
            this.marker.remove();
            this.marker = null
            this.latlng.emit(undefined)
          }
        }
        this.logpresscheck()
      },
      onEnd: () => {
        this.active = false;
        // The click prevention will be handled by the click event listener
      },
    }, true);

    // Add click handler to prevent click after long press
    this.el.nativeElement.addEventListener('click', (e: Event) => {
      if (this.isLongPress) {
        e.preventDefault();
        e.stopPropagation();
        // Reset the flag after preventing the click
        setTimeout(() => {
          this.isLongPress = false;
        }, 50);
      }
    }, true);

    gesture.enable();
  }

  logpresscheck() {
    if(this.timer){
      clearTimeout(this.timer)
    }

    this.timer = setTimeout(() => {
      if(this.active){
        // Set the isLongPress flag to true
        this.isLongPress = true;

        // For button long press, emit the executeLongClick event
        if (!this.mapEventDirective) {
          console.log('🔥 Long press detected on button - emitting executeLongClick');
          this.executeLongClick.emit();
          return;
        }

        // For map long press, handle the map interaction
        if (this.mapEventDirective instanceof mapboxgl.Map) {
          setTimeout(() => {
            if(this.checker){
              this.mapEventDirective.off('click', this.addMarker);

              console.log('111111 checker is false 1111111');
              this.mapEventDirective.once('click', (event: any) => this.addMarker(event));
              this.eventListenerDetected.emit('click');
            }
          }, 100)

        } else {
          console.error('mapEventDirective is not a Mapbox Map instance');
        }
      }
    }, 1000)
  }

  //  addMarker = async (event:any) =>{

  //   console.log('checker is ' + this.checker);


  //   if(this.checker){
  //     console.log("add marker method");
  //     console.log("this is marker " + this.marker);
  //     console.log('Map clicked at:', event.latLng.toJSON());
  //     if(this.marker == undefined){
  //       const beachFlagImg = document.createElement('img');
  //       beachFlagImg.src = '../../../../assets/icon/markerGray.png';


  //       const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
  //       this.marker = new AdvancedMarkerElement({
  //         position: new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()),
  //         content: beachFlagImg
  //       });

  //       this.markers.push(this.marker);
  //       console.log(this.markers);

  //       this.latlng.emit({marker:this.marker, markers:this.markers})
  //       this.marker.setMap(this.mapEventDirective);
  //     }else{
  //       if(this.eventListener){
  //         google.maps.event.removeListener(this.eventListener)
  //       }
  //     }

  //   }
  // }

  addMarker = async (event: any) => {
    console.log('checker is ' + this.checker);

    if (this.checker) {
      console.log("add marker method");

      if (!this.marker) {
        console.log('Map clicked at:', event.lngLat);

        // Create custom HTML element for marker
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.backgroundImage = 'url(../../../../assets/icon/markerGray.png)';
        el.style.width = '38px';
        el.style.height = '38px';
        el.style.backgroundSize = '100%';
        el.style.cursor = 'pointer';

        // Create a new Mapbox marker
        this.marker = new mapboxgl.Marker(el)
          .setLngLat([event.lngLat.lng, event.lngLat.lat])
          .addTo(this.mapEventDirective!);

        this.markers.push(this.marker);
        this.latlng.emit({ marker: this.marker, markers: this.markers });

        console.log(this.markers);

        // Emit the marker data
        this.latlng.emit({ marker: this.marker, markers: this.markers });
      } else {
        // Handle case if marker already exists
        console.log('Marker already exists.');
      }
    }

}

clearMarkers() {
  this.markers.forEach(marker => marker.remove());
  this.markers = [];
}

}
