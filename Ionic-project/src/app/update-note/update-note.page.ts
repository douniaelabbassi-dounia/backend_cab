import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { ListPointsService } from '../utiles/services/points/list-points.service';
import { presentToast } from '../utiles/component/notification';
import { Day } from '../utiles/interface/day-list';
import { Keyboard } from '@capacitor/keyboard';

@Component({
  selector: 'app-update-note',
  templateUrl: './update-note.page.html',
  styleUrls: ['./update-note.page.scss'],
})
export class UpdateNotePage implements OnInit {
  dayList:Array<Day> = [
      {index: 1, name: "Lun", activated: false},
      {index: 2, name: "Mar", activated: false},
      {index: 3, name: "Mer", activated: false},
      {index: 4, name: "Jeu", activated: false},
      {index: 5, name: "Ven", activated: false},
      {index: 6, name: "Sam", activated: false},
      {index: 7, name: "Dim", activated: false},
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
  
  pointId: string | null = '';

  makeBoxFullHeight:boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pointsService: ListPointsService
  ) {}

  ngOnInit() {
    Keyboard.addListener('keyboardWillShow', () => {
      this.makeBoxFullHeight = true;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      this.makeBoxFullHeight = false;
    });
    
    this.route.paramMap.subscribe((param) => {
      this.pointId = param.get('id');
      console.log('Point ID :', this.pointId);
      this.getDetailPoint(this.pointId);
    });
  }
  
  getDayOfWeek(dateStr: string): string {
    const [day, month, year] = dateStr.split('-').map(Number);
    const date = new Date(year, month , day);
    const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    
    return days[date.getDay()];
  }

  close() {
    this.router.navigate(['map']);
  }
  getDetailPoint(id: string | null) {
    if (id != null) {
      const json = {
        pointId: id,
      };
  
      this.pointsService.$getPoints().subscribe((data: any) => {
        console.log('Données reçues depuis l\'API :', data);
        const notePoint = data.note?.find((point: any) => point.id == id);
        
        if (notePoint) {
          this.lieu = notePoint.lieu || '';
          this.heureDebut = notePoint.heureDebut || '00:00';
          this.Type = notePoint.type || ''
          this.destination = notePoint.name || ''
          
          const dayName = this.getDayOfWeek(notePoint.date || '');

          // Find the day in dayList and activate it
          const selectedDay = this.dayList.find(d => d.name === dayName);
          if (selectedDay) {
            selectedDay.activated = true;
          }
          // console.log('Message :', this.message, 'Numéro de téléphone :', this.phoneNumber);
        } else {
          console.log('No note data found with the provided ID.');
        }
      });
    } else {
      console.log('ID nul : impossible de récupérer les détails.');
    }
  }
  
  updatePoint() {
    let dateIn = new Date();
    const content = {
      pointId: this.pointId,
      lieu: this.lieu,
      lat:this.selectedposition.lat,
      lg:this.selectedposition.lon,
      date:
              dateIn.getDate() +
              '-' +
              dateIn.getMonth() +
              '-' +
              dateIn.getFullYear()
              ,
      heureDebut: this.heureDebut,
      type: this.Type,
      destination: this.destination,
      friendsSelector: this.friendsSelector
    };

    console.log('Contenu mis à jour :', content);

    this.pointsService.$updatePoint(content).subscribe((data: any) => {
      if (data && data.success === true) {
        presentToast('Note a été modifié avec succès !', 'bottom', 'success');
        this.router.navigate(['map']);
      }
    });
  }
  selectDay(selectedday:any, event:any){
    let status = event.target.checked

    if(status){
      console.log("checked form : "+selectedday.name);
      this.checkOruncheck(selectedday.name)

      this.selectedDays.push(selectedday);

    }else{
      console.log("uncheckedform : "+selectedday);
      this.checkOruncheck(selectedday.name)
      this.selectedDays.splice(this.selectedDays.indexOf(selectedday),1)
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

  
}
