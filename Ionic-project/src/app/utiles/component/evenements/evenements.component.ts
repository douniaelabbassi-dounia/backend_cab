import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import axios from 'axios';
import { presentToast } from '../notification';
import { Subject } from 'rxjs';
import {distinctUntilChanged, debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-evenements',
  templateUrl: './evenements.component.html',
  styleUrls: ['./evenements.component.scss'],
})
export class EvenementsComponent  implements OnInit {

  @Input() evenementsDisplay:any;
  @Output() closeEvenements =new EventEmitter()
  @Output() submitEvent =new EventEmitter()

  type:string = "";
  selectedposition:{name:string, display_name:string, lat:number, lon:number} = {
    name:'',
    display_name:'',
    lat:0,
    lon:0
  };

  suggestions: Array<any> = [];
  private searchSubject: Subject<string> = new Subject<string>();
  focusInput:boolean = false;
  displayModal: any = {
    displayDate:false,
    displayTimebegin:false,
    displayTimeEnd:false
  };
  valide: boolean = true;
  isLocationValid: boolean = false;

  error_message =  [
    /*0*/ {name: "lieu",message:"Lieu est obligatoire.", display:false, input:''},
    /*1*/ {name: "date",message:"Date est obligatoire.", display:false, input:''},
    /*2*/ {name: "heure debute",message:"Heure debute est obligatoire.", display:false, input:''},
    /*3*/ {name: "Heure fin",message:"Heure fin est obligatoire.", display:false, input:''}
  ];

  input:any;

  position:{lat:number, lng:number} = {
    lat:0,
    lng:0
  }

  constructor( ) {
    // ------------------- auto complate with openSreetMap --------------------------------
    this.searchSubject.pipe(
      debounceTime(500), // Adjust the debounce time as per your requirement (e.g., 1000ms = 1 second)
      distinctUntilChanged()
    ).subscribe(() => {
      this.onAddressInput();
    });
    // ------------------- auto complate with openSreetMap --------------------------------
   }

  ngOnInit() {
    // this.autocomplete();
  }



// -------------------------------- openSreetMap --------------------------------
  onAddressChange() {
    this.searchSubject.next(this.error_message[0].input);
  }
// -------------------------------- openSreetMap --------------------------------

// -------------------------------- openSreetMap --------------------------------
  // async onAddressInput() {
  //   if (this.error_message[0].input.length > 2) { // Adjust the minimum length as per your requirement
  //     try {
  //       const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${this.error_message[0].input}&format=json`);
  //       this.suggestions = response.data;
  //       console.log("this is the content of api OSM : " + JSON.stringify(this.suggestions));

  //     } catch (error:any) {
  //       console.error('Error fetching address suggestions:', error);
  //     }
  //   } else {
  //     this.suggestions = [];
  //   }
  //   console.log("called!! " + this.error_message[0].input);

  // }

searchTimeout: any;

async onAddressInput() {
  clearTimeout(this.searchTimeout);
  const query = this.error_message[0].input.trim();
  // As soon as the user edits the input, consider the selection invalid until a suggestion is chosen
  this.isLocationValid = false;
  this.selectedposition = { name: '', display_name: '', lat: 0, lon: 0 };

  if (query.length > 3) {
    this.searchTimeout = setTimeout(async () => {
      try {
        const left = -5.5, top = 51.5, right = 10.0, bottom = 41.0;
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&accept-language=fr&countrycodes=fr&bounded=1&viewbox=${left},${top},${right},${bottom}`);
        this.suggestions = response.data;
        console.log("OSM API content:", JSON.stringify(this.suggestions));
        if (!Array.isArray(this.suggestions) || this.suggestions.length === 0) {
          presentToast("Ce lieu n'existe pas en France", 'bottom', 'warning');
        }
      } catch (error: any) {
        console.error('Error fetching address suggestions:', error);
      }
    }, 400); // 500ms debounce delay
  } else {
    this.suggestions = [];
  }
}


// -------------------------------- openSreetMap --------------------------------

// -------------------------------- openSreetMap --------------------------------
  onSelectAddress(selectedAddress: any) {
    // Handle the selected address, update your form or model accordingly
    console.log('Selected Address:', selectedAddress);
    this.selectedposition.name = selectedAddress.name;
    this.selectedposition.display_name = selectedAddress.display_name;
    this.selectedposition.lat = selectedAddress.lat;
    this.selectedposition.lon = selectedAddress.lon;

    this.error_message[0].input = selectedAddress.display_name
    this.suggestions = [];
    this.isLocationValid = true;

  }
// -------------------------------- openSreetMap --------------------------------

// -------------------------------- openSreetMap --------------------------------
  blurInput(){
    setTimeout(()=>{
      this.focusInput=false
    },100)
  }
// -------------------------------- openSreetMap --------------------------------


  // autocomplete(){
  //   // Create the search box and link it to the UI element.
  //   this.input = document.getElementById("pac-input-event") as HTMLInputElement;
  //   const searchBox = new google.maps.places.SearchBox(this.input);


  //   // Listen for the event fired when the user selects a prediction and retrieve
  //   // more details for that place.
  //   searchBox.addListener("places_changed", () => {
  //     const places = searchBox.getPlaces();

  //     if (places?.length == 0) {
  //       return;
  //     }

  //     places?.forEach((place) => {
  //       if (!place.geometry || !place.geometry.location) {
  //         console.log("Returned place contains no geometry");
  //         return;
  //       }
  //       console.log(place);

  //       if (place.formatted_address) {
  //         this.error_message[0].input = place.formatted_address!;
  //         this.position.lat = place.geometry.location.lat();
  //         this.position.lng = place.geometry.location.lng();
  //       }

  //     });

  //   });
  // }

  toggaleModal(modal:string) {
    switch (modal) {
     case 'date':
       this.displayModal.displayDate = !this.displayModal.displayDate;
       break;

     case 'time-begin':
       this.displayModal.displayTimeBegin = !this.displayModal.displayTimeBegin;
       break;

     case 'time-end':
       this.displayModal.displayTimeEnd = !this.displayModal.displayTimeEnd;
       break;

     default:
       break;
    }
   }

   setValue(newValue:any, input:string){
    console.log("this is the new vavlue : "+ newValue);
    console.log('date debut ' + newValue[0] + " date fin " + newValue[1]);

    switch (input) {
      case 'date':
          if(newValue.length == 1){
          this.error_message[1].input = this.formatDateAndTime(newValue[0], 'date');
          }else if(newValue.length > 1){
            this.error_message[1].input = ""
            newValue.forEach((date:string, index:number) => {
              if(index > 0 && index <= newValue.length - 1){
                this.error_message[1].input += ' - '
              }
              this.error_message[1].input += this.formatDateAndTime(date, 'date')
            });
          }
        // this.error_message[1].input = this.formatDateAndTime(newValue, 'date')
        console.log('( date ) outside of the component : ' +  this.error_message[1].input);
        break;
      case 'timeBegin':
         this.error_message[2].input = this.formatDateAndTime(newValue, 'time')
        console.log('( heureDebut ) outside of the component : ' + this.error_message[2].input);
          break;
      case 'timeEnd':
        this.error_message[3].input = this.formatDateAndTime(newValue, 'time')
        console.log('( heureEnd ) outside of the component : ' + this.error_message[3].input);
        break;
      default:
        break;
    }
  }

  formatDateAndTime(getvalue:string, format:string) :string {
    const date = new Date(getvalue);
    switch (format) {
      case 'date':
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/');

      case 'time':
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        return `${hours}:${minutes}`;

      default:
        return '';
    }
  }


  validation(){
    // Block submit if no valid geocoded selection
    if (!this.isLocationValid || !this.selectedposition.lat || !this.selectedposition.lon) {
      this.error_message[0].message = 'Veuillez sélectionner un lieu valide dans la liste.';
      this.error_message[0].display = true;
      return;
    }

    if( this.error_message[0].input != '' &&
      this.error_message[1].input != '' &&
      this.error_message[2].input != ''){
      this.submit()

    }else{
      this.error_message.forEach(el => {
        console.log(el.input);

        if(el.input == '') {
          el.display = true
        }else {
          el.display = false;
        }
      })
    }
  }

  submit(){

    this.submitEvent.emit({
      lieu: this.error_message[0].input,
      lat:this.selectedposition.lat,
      lg:this.selectedposition.lon,
      type: this.type == '' ? '----' : this.type,
      date: this.error_message[1].input,
      heureDebut: this.error_message[2].input,
      heureFin: this.error_message[3].input,
      position: this.position
      });
      console.log('lieu ',this.error_message[0].input)
    this.close()
  }

  close(){
    this.closeEvenements.emit();
  }


}
