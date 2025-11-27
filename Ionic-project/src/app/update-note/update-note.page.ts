import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { ListPointsService } from '../utiles/services/points/list-points.service';
import { presentToast } from '../utiles/component/notification';
import { Day } from '../utiles/interface/day-list';
import { Keyboard } from '@capacitor/keyboard';

const DAY_ALIASES: Record<string, string> = {
  '0': 'Dim', '7': 'Dim', 'dim': 'Dim', 'dimanche': 'Dim', 'sun': 'Dim', 'sunday': 'Dim',
  '1': 'Lun', 'lun': 'Lun', 'lundi': 'Lun', 'mon': 'Lun', 'monday': 'Lun',
  '2': 'Mar', 'mar': 'Mar', 'mardi': 'Mar', 'tue': 'Mar', 'tuesday': 'Mar',
  '3': 'Mer', 'mer': 'Mer', 'mercredi': 'Mer', 'wed': 'Mer', 'wednesday': 'Mer',
  '4': 'Jeu', 'jeu': 'Jeu', 'jeudi': 'Jeu', 'thu': 'Jeu', 'thursday': 'Jeu',
  '5': 'Ven', 'ven': 'Ven', 'vendredi': 'Ven', 'fri': 'Ven', 'friday': 'Ven',
  '6': 'Sam', 'sam': 'Sam', 'samedi': 'Sam', 'sat': 'Sam', 'saturday': 'Sam',
  '*': '*'
};

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
    heureFin: string = '';

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
          this.heureFin = notePoint.heureFin || this.heureDebut;
          this.Type = notePoint.type || '';
          const rawDestination = typeof notePoint.name === 'string' ? notePoint.name.trim() : '';
          const sanitizedLieu = typeof notePoint.lieu === 'string' && notePoint.lieu.length > 0
            ? notePoint.lieu.split(',')[0].trim()
            : '';
          if (!rawDestination || rawDestination.toLowerCase() === 'mémo' || rawDestination === sanitizedLieu) {
            this.destination = '';
          } else {
            this.destination = rawDestination;
          }
          this.friendsSelector = notePoint.visibility || 'personne'; // Load visibility setting
          const lat = parseFloat(notePoint.lat);
          const lng = parseFloat(notePoint.lng);
          const hasValidCoords = !isNaN(lat) && !isNaN(lng);
          this.selectedposition = {
            name: notePoint.name,
            display_name: notePoint.lieu,
            lat: hasValidCoords ? lat : 0,
            lon: hasValidCoords ? lng : 0
          };
          this.isLocationValid = hasValidCoords;
          this.isLocationValid = hasValidCoords;

          // Reset all days first
          this.dayList.forEach(d => d.activated = false);
          this.selectedDays = [];

          const storedDays = (notePoint.date || '').split(',');
          storedDays.forEach((token: string) => {
            const canonical = this.normalizeDayToken(token);
            if (!canonical) { return; }
            if (canonical === '*') {
              this.dayList.forEach(day => {
                day.activated = true;
                if (!this.selectedDays.includes(day.name)) {
                  this.selectedDays.push(day.name);
                }
              });
              return;
            }
            const day = this.dayList.find(d => d.name === canonical);
            if (day) {
              day.activated = true;
              if (!this.selectedDays.includes(day.name)) {
                this.selectedDays.push(day.name);
              }
            }
          });
          // console.log('Message :', this.message, 'Numéro de téléphone :', this.phoneNumber);
        } else {
          console.log('No note data found with the provided ID.');
        }
      });
    } else {
      console.log('ID nul : impossible de récupérer les détails.');
    }
  }

  private sanitizeLieu(raw: string): string {
    if (!raw) return '';
    const clean = String(raw).replace(/\s+/g, ' ').trim();
    // Truncate to a safe length to prevent database errors
    return clean.length > 190 ? clean.slice(0, 190) : clean;
  }

  updatePoint() {
    if (!this.isLocationValid) {
      presentToast('Veuillez sélectionner un lieu valide dans la liste.', 'bottom', 'warning');
      return;
    }

    const trimmedDestination = (this.destination || '').trim();
    const content = {
      pointId: this.pointId,
      type: 'note',
      name: trimmedDestination,
      lieu: this.sanitizeLieu(this.lieu),
      date: this.selectedDays.map(day => day.trim()).filter(Boolean).join(','),
      heureDebut: this.heureDebut,
      heureFin: this.heureFin,
      friendsSelector: this.friendsSelector,
      noteType: this.Type,
      lat: this.selectedposition.lat,
      lng: this.selectedposition.lon,
      address: this.sanitizeLieu(this.lieu),
    };

    console.log('Contenu mis à jour :', content);

    this.pointsService.$updatePoint(content).subscribe((data: any) => {
      if (data && data.success === true) {
        presentToast('Note a été modifié avec succès !', 'bottom', 'success');
        // Store the updated note ID so map can show it immediately regardless of schedule
        if (this.pointId) {
          localStorage.setItem('justUpdatedNoteId', this.pointId);
        }
        this.router.navigate(['map']);
      }
    });
  }
  selectDay(selectedday:any, event:any){
    let status = event.target.checked

    if(status){
      console.log("checked form : "+selectedday.name);
      this.checkOruncheck(selectedday.name)

      if (!this.selectedDays.includes(selectedday.name)) {
        this.selectedDays.push(selectedday.name);
      }

    }else{
      console.log("uncheckedform : "+selectedday);
      this.checkOruncheck(selectedday.name)
      const index = this.selectedDays.indexOf(selectedday.name);
      if (index !== -1) {
        this.selectedDays.splice(index,1)
      }
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

  private normalizeDayToken(token: string): string | null {
    if (!token) { return null; }
    const normalized = token.trim().toLowerCase();
    if (!normalized) { return null; }
    const alias = DAY_ALIASES[normalized];
    if (alias) { return alias; }
    // Attempt numeric parse in case alias map missed a variant
    const numeric = parseInt(normalized, 10);
    if (!Number.isNaN(numeric)) {
      if (numeric >= 0 && numeric <= 6) {
        const mapping = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
        return mapping[numeric];
      }
      if (numeric === 7) {
        return 'Dim';
      }
    }
    return null;
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
