import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import axios from 'axios';
import { Day } from 'src/app/utiles/interface/day-list';
import { presentToast } from '../notification';
import { Keyboard } from '@capacitor/keyboard';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent  implements OnInit {

  @Input() noteDisplay:any;
  @Output() closeNote = new EventEmitter();
  @Output() submitNote = new EventEmitter();

  dayList:Array<Day> = [
    {index: 1, name: "Lun", activated: false}, // Monday
    {index: 2, name: "Mar", activated: false}, // Tuesday
    {index: 3, name: "Mer", activated: false}, // Wednesday
    {index: 4, name: "Jeu", activated: false}, // Thursday
    {index: 5, name: "Ven", activated: false}, // Friday
    {index: 6, name: "Sam", activated: false}, // Saturday
    {index: 0, name: "Dim", activated: false}, // Sunday
  ];

  lieu:string="";
  selectedDays:Array<string> = [];
  heure:string = "";
  Type:string = "" // ex : Entreprise, hotel, particulier...
  destination: string = ""; // ex : Paris
  friendsSelector:string = "personne"; // tous les amis, personne


  // autocomplete variables
  suggestions: Array<any> = [];
  focusInput:boolean = false;
  isLocationValid: boolean = false;
  selectedposition:{name:string, display_name:string, lat:number, lon:number} = {
    name:'',
    display_name:'',
    lat:0,
    lon:0
  };
  // autocomplete variables

  displayModal:any = {
    displayDate: false,
    displayTimeBegin: false,
    displayTimeEnd: false,
  }
  heureDebut: string = '';

  makeBoxFullHeight:boolean = false;
  constructor() { }

  ngOnInit() {
    Keyboard.addListener('keyboardWillShow', () => {
      // Run your function here
      // presentToast("the keyboard is comming !!! value : "+this.makeBoxFullHeight, "top", 'success');
      this.makeBoxFullHeight = true;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      // presentToast("the keyboard is leaving !!! value : "+this.makeBoxFullHeight, "bottom", 'success');
      this.makeBoxFullHeight = false;
    });
  }



  selectDay(selectedday:any, event:any){
    let status = event.target.checked

    if(status){
      console.log("checked form : "+selectedday.name);
      this.checkOruncheck(selectedday.name)
      // We now push the day's index (number) instead of the whole object
      this.selectedDays.push(selectedday.index);

    }else{
      console.log("uncheckedform : "+selectedday);
      this.checkOruncheck(selectedday.name)
      this.selectedDays.splice(this.selectedDays.indexOf(selectedday.index),1)
    }
    console.log("list : "+ this.selectedDays);
  }

  selectSelectorFiends(type:string){
    console.log("this is the selected type : "+type);

    this.friendsSelector = type
  }

  findDayElement(name:string):Day{

    let element = this.dayList.find(el => el.name == name)
    if(element){
      console.log("this is the result of search : " + JSON.stringify(element));
      return element;
    }
    console.log("this is the result of search : " + JSON.stringify({index:0, name:'', activated:false}));
    return {index:0, name:'', activated:false};
  }

  // this method for days section
  checkOruncheck(dayName:string){
   let dayElement = this.findDayElement(dayName);
   if(dayElement.index != 0){
     dayElement.activated = !dayElement.activated
     console.log("switch checker is done !!!");
   }else{
     console.error("switch checker isn't done !!!, the dayName not find (findDayElement Method take name not find in dayList array! ");
   }
  }

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

   setValue(newValue: string, input:string){
    console.log("this is the new vavlue : "+ newValue);

    switch (input) {

      case 'timeBegin':
         this.heureDebut = this.formatDateAndTime(newValue, 'time')
        console.log('( heureDebut ) outside of the component : ' + this.heureDebut);
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

   async onAddressInput() {
    if (this.lieu.length > 3) { // Adjust the minimum length as per your requirement
      try {
        const left = -5.5, top = 51.5, right = 10.0, bottom = 41.0;
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(this.lieu)}&format=json&addressdetails=1&limit=5&accept-language=fr&countrycodes=fr&bounded=1&viewbox=${left},${top},${right},${bottom}`
        );
        this.suggestions = response.data;
        console.log("this is the content of api OSM : " + JSON.stringify(this.suggestions));
        if (!Array.isArray(this.suggestions) || this.suggestions.length === 0) {
          presentToast("Ce lieu n'existe pas en France", 'bottom', 'warning');
        }
        // Any typing invalidates previous selection
        this.isLocationValid = false;
        this.selectedposition = { name:'', display_name:'', lat:0, lon:0 };
      } catch (error:any) {
        console.error('Error fetching address suggestions:', error);
      }
    } else {
      this.suggestions = [];
      this.isLocationValid = false;
      this.selectedposition = { name:'', display_name:'', lat:0, lon:0 };
    }
    console.log("called!! " + this.lieu);

  }

   onSelectAddress(selectedAddress: any) {
    // Handle the selected address, update your form or model accordingly
    console.log('Selected Address:', selectedAddress);
    this.selectedposition.name = selectedAddress.name;
    this.selectedposition.display_name = selectedAddress.display_name;
    this.selectedposition.lat = selectedAddress.lat;
    this.selectedposition.lon = selectedAddress.lon;

    this.lieu = selectedAddress.display_name
    this.isLocationValid = true;
  }

  blurInput(){
    setTimeout(()=>{
      this.focusInput=false
    },100)
  }


  submit(){
    if (!this.isLocationValid || !this.selectedposition.lat || !this.selectedposition.lon) {
      presentToast('Veuillez sélectionner un lieu valide dans la liste.', 'bottom', 'danger');
      return;
    }
    const noteData = {
      lieu: this.lieu,
      lat:this.selectedposition.lat,
      lg:this.selectedposition.lon,
      selectedDays: this.selectedDays,
      heure: this.heureDebut,
      type: this.Type,
      destination: this.destination,
      friendsSelector: this.friendsSelector
    };
    // Log the data to the console before emitting it
    console.log("Data to be submitted:", noteData);
    // Emit the data
    this.submitNote.emit(noteData);

    // Close the note component
    this.close();
  }


  close(){
    this.closeNote.emit();
  }

}

