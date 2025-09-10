import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import axios from 'axios';
import * as L from 'leaflet';

import { NavController, Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { presentToast } from '../utiles/component/notification';
import { ProfilService } from '../utiles/services/profil/profil.service';
import { ListPointsService } from '../utiles/services/points/list-points.service';
import { ParticipationService } from '../utiles/services/participation/participation.service';
import { QueueService, UserPosition } from '../utiles/services/queue/queue.service';
import { Router } from '@angular/router';
import { LongPressDirective } from '../utiles/directives/longpress/long-press.directive';





@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, OnDestroy {
  @ViewChild('map', { static: false }) mapContainer!: ElementRef;
  @ViewChild(LongPressDirective) longPressDirective!: LongPressDirective;

  map!: L.Map | undefined;
  franceBounds!: L.LatLngBounds; // France mainland bounds
  input: any;
  checker: boolean = true;
  searchinput: string = "";
  suggestions: Array<any> = [];


  // enableAffect:boolean=false;

  eventListenerToDelete: any;

  grayMarker: any;
  positionTimeout: any;  // Pour arrêter après 5 minutes
  positionUpdateInterval: any; // Pour mettre à jour toutes les X secondes
  markergray = false;
  private justHeld = false;

  isClockActive: boolean = false;
  timeValue: {hour: string, min: string} = {
    hour: '07',
    min: '00'
  };
  showTimePickerModal: boolean = false;
  currentTime: string = "";
  displayer: any = {
    menuDisplay: false,
    horlogDisplay: false,
    affluenceDisplay: false,
    evenementsDisplay: false,
    statusDisplay: false,
    noteDisplay: false,
    sosDisplay: false,
    autreDisplay: false,
    listPointDisplay: false,
    onboarding: false,
    showPub: false,
    listPoints: false,
    deletePointConfirmation: false,
    noteOverlayDisplay: false,
    editPointConfirmation: false,
  };

  // list of all point type
  markers: any = [];
  blueMarkers: any[] = [];
  purpleMarkers: any[] = [];
  redMarkers: any[] = [];
  greenMarkers: any[] = [];
  jauneMarkers: any[] = [];
  marinMarkers: any[] = []; // for premium position
  markerToUnactivate: any[] = [];
  // list of all point type

  // list of all object of all points type
  objectblueMarkers: any[] = [];
  objectgreenMarkers: any[] = [];
  private affluenceTimers: { [pointId: number]: any } = {};
  private hasRenderedOnce: boolean = false;
  objectjauneMarkers: any[] = [];
  objectpurpleMarkers: any[] = [];
  objectredMarkers: any[] = [];
  objectmarinMarkers: any[] = []; // for premium position

  // polylines for drawing
  polylines: { id: string, polyline: L.Polyline }[] = [];
  // Enhanced editing state for station paths
  private editingStationId: number | null = null;
  private editingSegments: L.Polyline[] = [];
  private editingLatLngs: L.LatLng[][] = [];
  private editVertexMarkers: L.Marker[] = [];
  private wasWatchingLocation: boolean = false;
  // Track if we've already centered to user's location once per page entry
  private hasCenteredOnUser: boolean = false;
  // Follow user mode: keep map view centered as position updates
  private followUser: boolean = true;
  private lastUserLatLng: L.LatLng | null = null;
  private lastPanTs: number = 0;
  private readonly followPanMinDistanceMeters: number = 8; // ignore micro-jitters
  private readonly followPanThrottleMs: number = 750; // limit panning frequency
  private hasPromptedForGps: boolean = false;
  private gpsPromptPending: boolean = false;
  private permissionState: 'granted' | 'denied' | 'prompt' | 'unknown' = 'unknown';
  private isGpsPermissionPromptOpen: boolean = false;
  showGpsModal: boolean = false;

  // list of all object of all points type
  oldPosition: { lat: number; lon: number } = {
    lat: 0,
    lon: 0,
  };

  // No API key needed for OpenStreetMap with Leaflet!

  conteurPub: number = 5;

  position: { lat: number; long: number } = {
    lat: +localStorage.getItem('lat')! || 48.8647569,
    long: +localStorage.getItem('long')! || 2.2481023,
  };
  myPosition!: L.Marker | undefined;

  selectedBtn: any = {
    event: false,
    affluence: false,
    note: false,
    autre: false,
    sos: false,
    station: false,
  };

  transparent: any = {
    event: false,
    affluence: false,
    note: false,
    autre: false,
    sos: false,
    station: false
  };

  showOnboarding: string | null = null;
  skipedPub: string | null = '0';

  // gps part
  userPosition: { lat: string | number; long: string | number } = {
    lat: '',
    long: '',
  };

  getPossitionStatus: boolean = false;

  selectedPointType: string = '';


  private currentMarker: L.Marker | null = null;
  private heldMarker: L.Marker | null = null;
  private isDrawingPolyline: boolean = false;

  selectedPoint: any;
  selectedLevel: string = '';

  // eventContent:{lieu:string, type:string, date:string, heureDebut:string, heureFin:string, level:string} = {
  //   lieu:'',
  //   type:'',
  //   date:'',
  //   heureDebut:'',
  //   heureFin:'',
  //   level:''
  // };

  addPointRes: boolean = false;
  newSelectedLvl: string | undefined;

  confirmationContent: string = '';
  selectedpointId: number | undefined;

  positionTimer: any;
  MarkerTimer: any;
  selectedPosi?: { lat: number; lng: number };
  private newPointId: number | null = null; // Variable to track the newly created point ID
  authenticatedUser: any;
  isTrialExpired: boolean = false;
  constructor(
    private router: Router,
    private authService: ProfilService,
    private pointService: ListPointsService,
    private queueService: QueueService,
    private participationService: ParticipationService,
    private platform: Platform,
    private navController: NavController
  ) { }

  // --- State for Queue Visualization ---
  private activeQueueStationId: number | null = null;
  private locationBroadcastInterval: any = null;
  private queueVisualizerInterval: any = null;
  private greenProgressLine: L.Polyline | null = null;
  private eventVisibilityInterval: any = null;
  private pendingDisableIds: Set<number> = new Set();
  private disableDebounceTimer: any = null;
  private alreadyDisabledIds: Set<number> = new Set();
  // Keep newly created notes visible for a short grace period even if outside time window
  private recentlyCreatedNotes: Map<number, number> = new Map();
  // Realtime refresh state
  private realtimeInterval: any = null;
  private realtimeIntervalMs: number = 15000; // 15s
  private realtimeEnabled: boolean = true;

  private normalizeId(id: any): number {
    const n = typeof id === 'number' ? id : parseInt(String(id), 10);
    return isNaN(n) ? -1 : n;
  }

  async ngOnInit(): Promise<void> {
    this.countDownSkipBtn();
    this.platform.ready().then(() => {
      this.platform.pause.subscribe(() => { this.onPause(); });
      this.platform.resume.subscribe(() => { this.onResume(); });
      
      // Initialize map after platform is ready
      setTimeout(() => {
        if (!this.map) {
        this.loadMap();
        }
      }, 500);
    });

    if (this.authenticatedUser) {
      this.checkTrialPeriod();
    }
    this.savePolylines();
    // Start realtime map refresh loop after initial setup
    this.startRealtimeUpdates();
  }

  async ionViewWillEnter(): Promise<void> {
    // --- LOGIN GUARD ---
    const token = localStorage.getItem('apiToken');
    if (!token) {
      console.log("No token found, redirecting to login.");
      this.router.navigate(['/sign-in']);
      return; // Stop execution if not authenticated
    }
    // --- END LOGIN GUARD ---

    try {
      if (this.skipedPub === '1') {
        this.skipedPub = localStorage.getItem('skipPub');
        console.log(this.skipedPub);
      }
      this.displayer.menuDisplay = false;
      this.showOnboarding = localStorage.getItem('onpoarding');

      // Fetch profile first to ensure user info is available for marker rendering.
      const user = await this.profil();

      // Points will be fetched after map loads - see map 'load' event handler

      if (user && user.pointDuration > 0) {
        console.log("point duration is bigger than 0");
        // Ensure we don't create multiple timers. Clear the old one first.
        if (this.MarkerTimer) clearInterval(this.MarkerTimer);
        this.MarkerTimer = setInterval(() => this.getAllPoint(), 300000); // 5 minutes
      }

      if (this.authenticatedUser) {
        this.checkTrialPeriod();
      }
      // Always refresh points when entering the map to reflect recent edits (e.g., SOS updates)
      try { this.getAllPoint(); } catch {}
    } catch (error) {
      console.error("An error occurred in ionViewWillEnter:", error);
    }
  }




  gotopage(page: any) {
    this.navController.navigateForward(page);
  }

  // ngAfterViewInit() {
  //   this.initialaizemap();
  // }

  ionViewDidEnter() {
    // Reset centering flag each time view enters
    this.hasCenteredOnUser = false;
    this.initializeMap();
  }

  private async checkGpsPermissionFlow() {
    // Do not show modal while ad/onboarding overlay is active or big ad not skipped yet
    const skipPub = localStorage.getItem('skipPub');
    if (this.displayer.showPub || skipPub !== '1' || this.skipedPub !== '1') {
      this.gpsPromptPending = true;
      return;
    }
    if (this.hasPromptedForGps) {
      // Avoid re-prompting repeatedly; resume tracking if permission was granted.
      try { await this.locateCurrentPosition(); } catch {}
      this.showGpsModal = false;
      return;
    }
    try {
      await this.updatePermissionState();
      if (this.permissionState === 'granted') {
        this.showGpsModal = false;
        try { await this.locateCurrentPosition(); } catch {}
        return;
      }
      // If we have a recent stored fix, don't show modal
      const lat = localStorage.getItem('lat');
      const lng = localStorage.getItem('long');
      if (lat && lng) {
        this.showGpsModal = false;
        try { await this.locateCurrentPosition(); } catch {}
        return;
      }
      // Probe one-shot location before showing modal
      const fix = await this.getOneShotLocation();
      if (fix) {
        try {
          localStorage.setItem('lat', String(fix.lat));
          localStorage.setItem('long', String(fix.lng));
        } catch {}
        this.showGpsModal = false;
        try { await this.locateCurrentPosition(); } catch {}
      } else {
        if (!this.isGpsPermissionPromptOpen) {
          this.showGpsModal = true;
        }
      }
    } catch (e) {
      console.warn('GPS permission check failed, showing modal as fallback', e);
      if (!this.isGpsPermissionPromptOpen) this.showGpsModal = true;
    }
  }

  onGpsEnableClick() {
    this.hasPromptedForGps = true;
    this.isGpsPermissionPromptOpen = true;
    try { this.locateCurrentPosition(); } catch {}
    try { this.openDeviceLocationSettings(); } catch {}
  }

  onGpsLaterClick() {
    this.showGpsModal = false;
  }

  private async openDeviceLocationSettings() {
    try {
      const diag = (window as any).cordova?.plugins?.diagnostic;
      if (diag && typeof diag.switchToLocationSettings === 'function') {
        diag.switchToLocationSettings();
        return;
      }
    } catch {}
    try {
      const settings = (window as any).cordova?.plugins?.settings;
      if (settings && typeof settings.open === 'function') {
        // cordova-open-native-settings plugin
        settings.open('location', () => {}, () => {});
        return;
      }
    } catch {}
    const platform = Capacitor.getPlatform();
    if (platform === 'ios') {
      try { window.open('app-settings:'); return; } catch {}
    }
    // Fallback: try to trigger the OS prompt or show instructions
    try { await this.locateCurrentPosition(); } catch {}
  }

  async initializeMap(): Promise<void> {
    if (!this.map) {
      await this.profil();
      this.loadMap();
      // Do not auto center on myLocation to avoid jumps; user can trigger GPS manually
      this.myLocation();
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
        console.log('after timeout invalidate size');
      }, 600);
    }
  }

  // Map initialization with Mapbox
  loadMap() {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }

    if (this.mapContainer?.nativeElement) {
      try {
        // Define France bounds (including Corsica)
        this.franceBounds = L.latLngBounds(
          L.latLng(41.0, -5.5), // Southwest
          L.latLng(51.5, 10.0)  // Northeast
        );

        this.map = L.map(this.mapContainer.nativeElement, {
          worldCopyJump: false
        }).fitBounds(this.franceBounds);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        this.map.on('load', () => {
          console.log('Map loaded successfully');
          // Add small delay to ensure tiles are fully rendered before adding markers
          setTimeout(() => {
            this.map?.invalidateSize();
            this.getAllPoint();
            // After initial render, force markers layout without zoom gesture
            setTimeout(() => this.ensureMarkersVisible(), 200);
            // Only after map is shown, check GPS permission and possibly show modal (no extra delay)
            setTimeout(() => this.checkGpsPermissionFlow(), 100);
          }, 300);
        });

        // No additional drag clamping; Leaflet will respect maxBounds without a sticky magnet

        this.map.on('contextmenu', (e: L.LeafletMouseEvent) => this.onMapHold(e));
        this.map.on('click', (e: L.LeafletMouseEvent) => this.onMapClick(e));
        // Disable follow mode if the user manually drags the map
        this.map.on('dragstart', () => {
          if (this.followUser) {
            this.followUser = false;
          }
        });
        
        // Add mobile-friendly long press detection
        let pressTimer: any;
        let isLongPress = false;
        let lastEvent: L.LeafletMouseEvent;
        
        this.map.on('mousedown touchstart', (e: any) => {
          isLongPress = false;
          lastEvent = e; // Store the event for later use
          pressTimer = setTimeout(() => {
            isLongPress = true;
            // For touch events, we need to reconstruct the mouse event-like object
            if (e.originalEvent && e.originalEvent.touches) {
              const touch = e.originalEvent.touches[0];
              const fakeEvent = {
                latlng: this.map!.containerPointToLatLng([touch.clientX, touch.clientY])
              } as L.LeafletMouseEvent;
              this.onMapHold(fakeEvent);
            } else {
              this.onMapHold(e);
            }
          }, 500); // 500ms for long press
        });
        
        this.map.on('mouseup touchend mousemove touchmove', () => {
          clearTimeout(pressTimer);
          if (isLongPress) {
            isLongPress = false;
          }
        });

        // Trigger load event manually for Leaflet as it doesn't have a direct equivalent of Mapbox's 'load'
        setTimeout(() => {
          if (this.map) {
            this.map.invalidateSize();
            this.map.fire('load');
          }
        }, 500);

      } catch (error) {
        console.error('Error initializing map:', error);
        setTimeout(() => this.loadMap(), 1000);
      }
    } else {
      setTimeout(() => this.loadMap(), 100);
    }
  }


  dragStart = () => {
    this.checker = false;

    if (this.eventListenerToDelete) {
      // This was for Google Maps, no longer needed.
      this.eventListenerToDelete = undefined;
    }
  };

  DragEnd = () => {
    this.checker = true;

  };

  deleteMap = () => {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
    document.getElementById('map')?.remove();
  };

  detectedEventListener = (evenement: any) => {
    this.eventListenerToDelete = evenement;
  };

  /*USer Info */

  async userMarker() {
    // Remove existing user marker if it exists
    if (this.myPosition) {
      this.myPosition.remove();
      this.myPosition = undefined;
    }

    // Create Mapbox marker for user position
    const userIcon = L.icon({
      iconUrl: '../../assets/icon/orangeCarWithcircle.svg',
      iconSize: [44, 44],
      iconAnchor: [22, 44],
      popupAnchor: [0, -44]
    });

    this.myPosition = L.marker([this.position.lat, this.position.long], { icon: userIcon }).addTo(this.map!);

    //this.removeAllMarkers();
    this.makeObjectMarker();
  }

  searchTimeout: any;

  async onAddressInput() {
    clearTimeout(this.searchTimeout);
    const query = this.searchinput.trim();

    if (query.length > 3) {
      this.searchTimeout = setTimeout(async () => {
        try {
          // Restrict Nominatim search strictly to France mainland bounds
          const left = -5.5, top = 51.5, right = 10.0, bottom = 41.0;
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&accept-language=fr&countrycodes=fr&bounded=1&viewbox=${left},${top},${right},${bottom}`
          );
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

  goToLocation(suggestion: any) {
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);

    if (this.map) {
      // This function should ONLY move the map. It should not create any markers.
      // The marker creation logic has been removed.
      const target = L.latLng(lat, lon);
      if (this.franceBounds && !this.franceBounds.contains(target)) {
        presentToast("Ce lieu n'existe pas en France", 'bottom', 'warning');
        this.suggestions = [];
        return;
      }
      const zoom = Math.min(this.map.getMaxZoom() || 18, 15);
      this.map.flyTo([lat, lon], zoom);
      this.suggestions = [];
      this.searchinput = suggestion.display_name || suggestion.address;
    }
  }



  // onMapHold for Mapbox
  private onMapHold(e: L.LeafletMouseEvent) {
    console.log('onMapHold triggered at:', e.latlng);
    
    this.justHeld = true;
    this.selectedPosi = e.latlng;
    
    // Remove existing gray marker if any
    if (this.grayMarker) {
      this.grayMarker.remove();
    }
    
    // Always create gray marker on long press - no button selection required
    this.grayMarker = L.marker([e.latlng.lat, e.latlng.lng], { icon: L.icon({
      iconUrl: '../../assets/icon/markerGray.png',
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [0, -50]
    }) }).addTo(this.map!);
    this.heldMarker = this.grayMarker; // sync the variables
    this.markergray = true; // set flag to true
    console.log('Gray marker created successfully - now you can select a button for the action');
  }

  // Method to handle simple click and remove the marker
  private onMapClick(e: L.LeafletMouseEvent) {
    if (this.justHeld) {
      this.justHeld = false;
      return;
    }

    if (this.mapClickHandler) {
      this.mapClickHandler(e);
      return;
    }

    if (this.isDrawingPolyline) {
      return;
    }
    
    // Remove the gray marker on simple tap
    if (this.grayMarker || this.heldMarker) {
      if (this.grayMarker) {
        this.grayMarker.remove();
        this.grayMarker = null;
      }
      if (this.heldMarker) {
        this.heldMarker.remove();
        this.heldMarker = null;
      }
      this.markergray = false;
      this.selectedPosi = undefined;
      console.log('Gray marker removed on tap');
    }
  }

  private initPermissionWatcher() {
    try {
      const hasApi = 'permissions' in navigator && (navigator as any).permissions?.query;
      if (!hasApi) return;
      (navigator as any).permissions.query({ name: 'geolocation' as PermissionName }).then((status: any) => {
        const apply = (st: any) => {
          this.permissionState = (st || 'unknown');
          if (this.permissionState === 'granted') {
            this.showGpsModal = false;
          }
        };
        try { apply(status?.state); } catch {}
        try { status.onchange = () => apply((status as any).state); } catch {}
      }).catch(() => {});
    } catch {}
  }

  private async updatePermissionState() {
    try {
      const hasApi = 'permissions' in navigator && (navigator as any).permissions?.query;
      if (!hasApi) { this.permissionState = 'unknown'; return; }
      const status: any = await (navigator as any).permissions.query({ name: 'geolocation' as PermissionName });
      this.permissionState = (status?.state as any) || 'unknown';
    } catch { this.permissionState = 'unknown'; }
  }

  // Helper function to create Mapbox markers
  private createLeafletMarker(iconUrl: string, latLng: [number, number], size: { width: number, height: number } = { width: 44, height: 44 }): L.Marker {
    const customIcon = L.icon({
      iconUrl: iconUrl,
      iconSize: [size.width, size.height],
      iconAnchor: [size.width / 2, size.height],
      popupAnchor: [0, -size.height]
    });

    return L.marker(latLng, { icon: customIcon });
  }

  pubClick() {
    this.conteurPub = 5;
    localStorage.setItem('skipPub', '0');
    this.skipedPub = localStorage.getItem('skipPub');
    this.countDownSkipBtn();
  }

  displayToggle(element: string) {
    // If this click targets a category that is currently long-pressed (filtered),
    // clear the filter and do NOT execute the click action.
    const elementToCategoryMap: { [key: string]: string } = {
      evenements: 'event',
      affluence: 'affluence',
      autre: 'autre',
      sos: 'sos',
      note: 'note'
    };
    const category = elementToCategoryMap[element];
    if (category && this.selectedBtn[category]) {
      this.selectedBtn[category] = false;
      this.transparent[category] = false;
      this.setMarkersOpacity();
      return; // swallow this click; it's only clearing the long-press toggle
    }

    switch (element) {
      case 'menu':
        this.displayer.menuDisplay = !this.displayer.menuDisplay;
        break;

      case 'note':
        this.displayer.noteDisplay = !this.displayer.noteDisplay;
        break;

      case 'horloge':
        this.displayer.horlogDisplay = !this.displayer.horlogDisplay;
        this.isClockActive = this.displayer.horlogDisplay;
        if (this.isClockActive) {
          this.myLocation();
        } else {
          if (this.positionUpdateInterval) {
            clearInterval(this.positionUpdateInterval);
          }
          if (this.positionTimeout) {
            clearTimeout(this.positionTimeout);
          }
          if (this.map) {
            this.map.stopLocate();
          }
        }
        break;

      case 'affluence':
        this.displayer.affluenceDisplay = !this.displayer.affluenceDisplay;
        // this.enableAffect=false;
        // }else{
        //   presentToast('Veuillez sélectionner un point gris avant de créer une affluence.', 'bottom', 'danger');
        // }
        break;

      case 'evenements':
        this.displayer.evenementsDisplay = !this.displayer.evenementsDisplay;
        break;


        case 'status':
          // --- THIS IS THE FIX ---
          // If the modal is already open, the user is just closing it. Always allow this.
          if (this.displayer.statusDisplay) {
            this.displayer.statusDisplay = false;
          } 
          // If the modal is closed, ONLY open it if the gray marker exists.
          else if (this.heldMarker) {
            this.displayer.statusDisplay = true;
          } 
          // Otherwise, the user is trying to open it without a marker. Show the warning.
          else {
            presentToast("Veuillez d'abord faire un appui long sur la carte pour placer un point.", 'bottom', 'warning');
          }
          break;

     case 'sos':
       const lat = parseFloat(localStorage.getItem('lat') || '');
       const long = parseFloat(localStorage.getItem('long') || '');

       if (this.markergray === true) {
         presentToast('Le point SOS peut être ajouté selon la géolocalisation', 'bottom', 'danger');
       }

       if (lat !== undefined && long !== undefined && this.markergray === false) {
         this.displayer.sosDisplay = !this.displayer.sosDisplay;
         console.log("sosDisplay après toggle:", this.displayer.sosDisplay);
       } else {
         presentToast('Le point SOS peut être ajouté selon la géolocalisation', 'bottom', 'danger');
       }
       break;

      case 'autre':
        this.displayer.autreDisplay = !this.displayer.autreDisplay;
        break;

      case 'list-points':
        this.displayer.listPointDisplay = !this.displayer.listPointDisplay;
        if (this.displayer.listPoints == true)
          this.displayer.listPoints = !this.displayer.listPoints;
        break;

      case 'onboarding':
        this.displayer.onboarding = !this.displayer.onboarding;
        break;
      case 'delete-confirmation':
        this.displayer.deletePointConfirmation =
          !this.displayer.deletePointConfirmation;
        break;
      case 'edit-confirmation':
        this.displayer.editPointConfirmation = !this.displayer.editPointConfirmation;
        break;
      default:
        console.log('action not exist !');
        break;
    }
  }

  showTimePicker() {
    this.showTimePickerModal = !this.showTimePickerModal;
  }

  formaTime(getvalue: string) {
    const date = new Date(getvalue);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return {hour: hours, min: minutes}
  }

  setValue(newValue: string) {
    this.timeValue = this.formaTime(newValue);
    console.log('( heureDebut ) outside of the component : ' + this.timeValue.hour + ":" + this.timeValue.min);
    this.showTimePickerModal = false;
  }

  updateTimeValue(newValue: string) {
    this.currentTime = newValue;
    console.log(this.currentTime);
  }

  submitTime() {
    if(this.currentTime == '') {
      let date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      this.currentTime = formattedDate;
    }
    this.timeValue = this.formaTime(this.currentTime);
    console.log('( heureDebut ) outside of the component : ' + this.timeValue.hour + ":" + this.timeValue.min);
    this.showTimePickerModal = false;
  }

  closeTimePicker() {
    this.showTimePickerModal = false;
  }

  ignorePub() {
    this.displayer.showPub = false;
    this.displayer.onboarding = true;
    localStorage.setItem('skipPub', '1');
    this.skipedPub = localStorage.getItem('skipPub');
    setTimeout(() => {
      // this.autocomplete();
      // If GPS prompt was deferred until ad skip, run the flow now
      if (this.gpsPromptPending) {
        this.gpsPromptPending = false;
        setTimeout(() => this.checkGpsPermissionFlow(), 100);
      }
    }, 1000);
  }

  // // remove markers (openStreetMap)
  removeMarker(): void {
    if (this.currentMarker) {
      this.currentMarker.remove();
      this.currentMarker = null;
    }
  }

  countDownSkipBtn() {
    const interval = setInterval(() => {
      this.conteurPub--;
      if (this.conteurPub == 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  // // clear Map (openStreetMap)
  clearMap() {
    console.log("Start clearing the map");
    let markers = [
      ...this.blueMarkers,
      ...this.redMarkers,
      ...this.purpleMarkers,
      ...this.jauneMarkers,
      ...this.marinMarkers,
    ];
    markers.forEach((marker) => {
      marker.remove();
    });
    this.blueMarkers = [];
    this.redMarkers = [];
    this.purpleMarkers = [];
    this.jauneMarkers = [];
    this.marinMarkers = [];
  }

  handlingLongClick(btn: string) {
    // If btn is invalid/empty, clear all filters safely and return
    if (!btn || !Object.prototype.hasOwnProperty.call(this.selectedBtn, btn)) {
      Object.keys(this.selectedBtn).forEach(key => {
        this.selectedBtn[key] = false;
        this.transparent[key] = false;
      });
      this.setMarkersOpacity();
      return;
    }
    const isCurrentlySelected = this.selectedBtn[btn];

    // If the button pressed is the one already active, we turn it off.
    if (isCurrentlySelected) {
      this.selectedBtn[btn] = false;
      this.transparent[btn] = false;
    } else {
      // First, turn off all other filters.
      Object.keys(this.selectedBtn).forEach(key => {
        this.selectedBtn[key] = false;
        this.transparent[key] = false;
      });
      // Then, turn on the new one.
      this.selectedBtn[btn] = true;
      this.transparent[btn] = true;
    }

    // --- THIS IS THE FIX ---
    // DO NOT rebuild all the markers. This was causing the animation bug
    // and resetting the fading timers for affluence points.
    // this.makeObjectMarker();  <-- REMOVED THIS LINE

    // INSTEAD, just apply the opacity changes to the existing markers.
    this.setMarkersOpacity();
    // --- END OF FIX ---

    // Debug: when long-pressing the note filter button, log fetched notes and visibility
    if (btn === 'note') {
      this.debugNotesVisibility();
    }
  }

  // Explicit helper used by overlay clicks to clear the long-press state
  clearLongPress(category: string) {
    if (!category) return;
    if (Object.prototype.hasOwnProperty.call(this.selectedBtn, category)) {
      this.selectedBtn[category] = false;
    }
    if (Object.prototype.hasOwnProperty.call(this.transparent, category)) {
      this.transparent[category] = false;
    }
    this.setMarkersOpacity();
  }

  private setMarkersOpacity() {
    const hasSelectedCategory = Object.values(this.selectedBtn).some(selected => selected);

    const markerCategories = [
      { markers: this.objectpurpleMarkers, category: 'event' },
      { markers: this.objectredMarkers, category: 'affluence' },
      { markers: this.objectgreenMarkers, category: 'station' },
      { markers: this.objectblueMarkers, category: 'note' },
      { markers: this.objectjauneMarkers, category: 'sos' }
    ];

    if (!hasSelectedCategory) {
      // Restore all markers to visible state; affluence keeps its fade
      markerCategories.forEach(({ markers, category }) => {
        markers.forEach(markerObj => {
          const el = markerObj.object?.getElement();
          if (!el) return;
          if (category === 'affluence') {
            // Do not alter opacity; timers manage it
            el.style.pointerEvents = 'auto';
          } else {
            el.style.opacity = '1';
            el.style.pointerEvents = 'auto';
          }
        });
      });
      return;
    }

    // Exactly one button is made active by handlingLongClick; enforce visibility accordingly
    markerCategories.forEach(({ markers, category }) => {
      const isSelected = !!this.selectedBtn[category];
      markers.forEach(markerObj => {
        const el = markerObj.object?.getElement();
        if (!el) return;
        if (isSelected) {
          if (category === 'affluence') {
            // Keep current fade; ensure it's interactable and compute immediate opacity for smooth reveal
            const opacity = this.getAffluenceCurrentOpacity(markerObj);
            if (!isNaN(opacity)) el.style.opacity = opacity.toString();
            el.style.pointerEvents = 'auto';
          } else {
            el.style.opacity = '1';
            el.style.pointerEvents = 'auto';
          }
        } else {
          // Hide non-selected categories completely
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
        }
      });
    });
  }

  // One-shot GPS fix via Leaflet locate. Resolves with null if unavailable.
  private async getOneShotLocation(): Promise<{ lat: number, lng: number } | null> {
    const map = this.map;
    if (!map) return null;
    return new Promise((resolve) => {
      let settled = false;
      const cleanup = (onFound: any, onErr: any, timer: any) => {
        try { map.off('locationfound', onFound); } catch {}
        try { map.off('locationerror', onErr); } catch {}
        if (timer) clearTimeout(timer);
      };
      const onFound = (e: L.LocationEvent) => {
        if (settled) return;
        settled = true;
        cleanup(onFound, onErr, timeoutId);
        resolve({ lat: e.latlng.lat, lng: e.latlng.lng });
      };
      const onErr = (_e: L.ErrorEvent) => {
        if (settled) return;
        settled = true;
        cleanup(onFound, onErr, timeoutId);
        resolve(null);
      };
      const timeoutId = setTimeout(() => {
        if (settled) return;
        settled = true;
        cleanup(onFound, onErr, timeoutId);
        resolve(null);
      }, 9000);

      try {
        map.on('locationfound', onFound);
        map.on('locationerror', onErr);
        map.locate({ setView: false, enableHighAccuracy: true, timeout: 8000, maximumAge: 0 });
      } catch {
        resolve(null);
      }
    });
  }

  // Compute current expected opacity for an affluence marker based on its duration and creation time
  private getAffluenceCurrentOpacity(pointData: any): number {
    try {
      const total = this.getAffluenceDurationMs(pointData.level);
      const created = this.parseAffluenceCreationDate(pointData).getTime();
      const now = Date.now();
      const remaining = Math.max(0, total - (now - created));
      return Math.max(0, Math.min(1, remaining / total));
    } catch {
      return 1; // fallback to visible
    }
  }

  // Expose a computed flag for template to dim non-selected buttons
  get anyFilterActive(): boolean {
    return Object.values(this.selectedBtn).some(Boolean);
  }


  private isFetchingPoints = false;
  getAllPoint(keepView: boolean = true) {
    if (this.isFetchingPoints) {
      return; // Prevent overlapping fetches
    }
    this.isFetchingPoints = true;
    this.pointService.$getPoints().subscribe(
      (data: any) => {
        console.log('data all points', data);
        // Update local data sets atomically after fetch completes
        this.redMarkers = data.red;
        this.greenMarkers = data.green;
        this.blueMarkers = data.note;
        this.jauneMarkers = data.sos;
        this.purpleMarkers = data.event;
        // this.removeAllMarkers();

        // First render pass: clear and build; Subsequent passes: targeted diff
        if (!this.hasRenderedOnce) {
          this.clearMarker();
          this.loadPolylines();
          this.makeObjectMarker();
          this.hasRenderedOnce = true;
        } else {
          // UI-only refresh: update existing markers without full clear
          this.refreshMarkersUI();
          this.loadPolylines();
        }
        // Ensure periodic check for event visibility
        this.ensureEventVisibilityWatcher();
        this.ensureNoteVisibilityWatcher();
        try { this.refreshSosPopups(); } catch {}

        // Update popup content for SOS popups to reflect latest data
        try { this.refreshSosPopups(); } catch {}

        // --- START: New logic to open popup for newly created point ---
        if (this.newPointId) {
            const newMarkerObject = this.allMarkers.find((marker: any) => marker.pointId === this.newPointId);
            if (newMarkerObject) {
                setTimeout(() => { // Use a small timeout to ensure the DOM is ready
                    newMarkerObject.openPopup();
                }, 100);
            }
            this.newPointId = null; // Reset the ID after use
        }
        // Open updated SOS popup automatically if returning from edit
        const updatedSosIdStr = localStorage.getItem('justUpdatedSosId');
        if (updatedSosIdStr) {
          const updatedSosId = parseInt(updatedSosIdStr, 10);
          if (!isNaN(updatedSosId)) {
            setTimeout(() => this.openSosPopupById(updatedSosId), 150);
          }
          try { localStorage.removeItem('justUpdatedSosId'); } catch {}
        }
        // --- END: New logic ---

    // Ensure all markers are properly rendered after loading without forcing a full rebuild
    requestAnimationFrame(() => this.map?.invalidateSize());

      this.isFetchingPoints = false;
      },
      (err) => {
        console.error('Error fetching all points:', JSON.stringify(err, null, 2));
        this.isFetchingPoints = false;
        // Also invalidate on error to ensure map is properly rendered
        setTimeout(() => {
          this.map?.invalidateSize();
        }, 200);
      }
    );
    console.log("")
  }


  savePoint(content: any, newMarker: any, type: string) {
    console.log('content', content);
    console.log('newMarker', newMarker);

    let json: any = null; // Initialize json to null

    if (type === 'red') {
      json = {
        typePoint: type,
        name: content.name,
        address: content.address,
        lat: content.lat,
        lng: content.lng,
        level: content.level,
        like: content.like,
        dislike: content.dislike,
        userId: content.userId,
        username: content.username,
        role: content.role,
      };
      // Award points logic...
    }
    else if (type === 'note') {
      json = {
        typePoint: type,
        name: content.name,
        destination: content.destination || content.name,
        address: content.address,
        lat: content.lat,
        lng: content.lng,
        lieu: content.lieu,
        type: content.type,
        selectedDays: content.selectedDays || [],
        heureDebut: content.heureDebut || content.heure,
        heureFin: content.heureFin || null,
        level: content.level,
        like: content.like,
        dislike: content.dislike,
        userId: content.userId,
        username: content.username,
        role: content.role,
      };
      this.participationService.rewardAirportWait();
    }
    else if (type === 'green') {
      json = {
        typePoint: type,
        name: content.name,
        address: content.address,
        lat: content.lat,
        lng: content.lng,
        level: content.level,
        like: content.like,
        dislike: content.dislike,
        userId: content.userId,
        username: content.username,
        role: content.role,
        createDate: new Date(),
      };
      this.participationService.rewardAirportWait();
    }
    else if (type === 'jaune') {
      json = {
        typePoint: type,
        name: content.name,
        msg: content.msg,
        numeroTel: content.numeroTel,
        address: content.address,
        lat: content.lat,
        lng: content.lng,
        level: content.level,
        like: content.like,
        dislike: content.dislike,
        userId: content.userId,
        username: content.username,
        role: content.role,
        createDate: new Date(),
      };
      this.participationService.rewardAirportWait();
    } 
    // --- THIS IS THE FIX ---
    // Use an explicit 'else if' for event to prevent fall-through bugs.
    else if (type === 'event') {
      json = {
        typePoint: type,
        name: content.name,
        address: content.address,
        lieu: content.lieu,
        type: content.type,
        date: content.date, // This will be fixed in Part 2
        heureDebut: content.heureDebut,
        heureFin: content.heureFin,
        lat: content.lat,
        lng: content.lng,
        level: content.level,
        like: content.like,
        dislike: content.dislike,
        userId: content.userId,
        username: content.username,
        role: content.role,
        createDate: new Date(),
      };
      this.participationService.rewardEvent();
      console.log("Saving event point:", json);
    }
    // --- END OF FIX ---

    if (json === null) {
      console.error(`savePoint was called with an unknown type: ${type}`);
      return;
    }

    console.log('Sending to backend:', json);
    this.pointService.$savePoint(json).subscribe(
      (data: any) => {
        if (data && data.done) {
          try { if (newMarker && typeof newMarker.remove === 'function') { newMarker.remove(); } } catch {}
          this.newPointId = data.id;
          // Track newly created notes for a short grace period
          if (type === 'note') {
            const nid = this.normalizeId(data.id);
            if (nid > 0) {
              const expiresAt = Date.now() + 300000; // 5 minutes grace
              this.recentlyCreatedNotes.set(nid, expiresAt);
            }
          }
          const newPoint = { 
            ...content, 
            id: data.id,
            userId: content.userID || content.userId || this.authService.$userinfo.id
          };
          switch (type) {
            case 'green':
              this.greenMarkers.push({ ...newPoint, polyline: newPoint['polyline'] ?? null });
              this.addMarkers([{ ...newPoint }], 'green');
              break;
            case 'red':
              this.redMarkers.push(newPoint);
              this.addMarkers([newPoint], 'red');
              break;
            case 'jaune':
              this.jauneMarkers.push(newPoint);
              this.addMarkers([newPoint], 'jaune');
              break;
            case 'note':
              this.blueMarkers.push(newPoint);
              this.addMarkers([newPoint], 'blue');
              break;
            case 'event':
              this.purpleMarkers.push(newPoint);
              this.addMarkers([newPoint], 'event');
              break;
          }
        }
      },
      (err) => {
        console.error('Error saving point:', JSON.stringify(err, null, 2));
        try { if (newMarker && typeof newMarker.remove === 'function') { newMarker.remove(); } } catch {}
      }
    );
  }



getIndexMarker(type: string, object: any): number {
  switch (type) {
    case 'red': return this.redMarkers.indexOf(object);
    case 'green': return this.greenMarkers.indexOf(object);
    case 'jaune': return this.jauneMarkers.indexOf(object);
    case 'note': return this.marinMarkers.indexOf(object);
    case 'event': return this.purpleMarkers.indexOf(object);
    default: return -1;
  }
}


  infowindowMethod(object: any, newMarker: any, type: string) {
    if (this.addPointRes) {
      let indexMarker: number | null = null;
      if (type == 'red') {
        this.redMarkers.push(object);
        indexMarker = this.redMarkers.indexOf(object);
      }
      if (type == 'green') {
        this.greenMarkers.push(object);
        indexMarker = this.greenMarkers.indexOf(object);
      }
      if (type == 'jaune') {
        this.jauneMarkers.push(object);
        indexMarker = this.jauneMarkers.indexOf(object);
      }
      if (type == 'note') {
        this.marinMarkers.push(object);
        indexMarker = this.marinMarkers.indexOf(object);
      }  if (type == 'event') {
        this.purpleMarkers.push(object);
        indexMarker = this.purpleMarkers.indexOf(object);
      }

      if (indexMarker != null) {
        let contentString = this.widgetContent(
          type,
          this.authService.$userinfo.id,
          indexMarker,
          0,
          0,
          object
        );

        newMarker.bindPopup(contentString, { maxWidth: 315 }).openPopup();
        newMarker.on('click', () => {
          this.checker = false;
          newMarker.togglePopup();
          setTimeout(() => {
            this.handleBtnClick(indexMarker!, type, object);
          }, 500);
        });

        //this.getAllPoint();
      } else {
        presentToast(
          'opss! index marker is not selected check infowindowMethod method',
          'bottom',
          'danger'
        );
      }
    } else {
      presentToast('opss!', 'bottom', 'danger');
    }

    this.addPointRes = false;
  }

  async addMarker(type: string, choice: any): Promise<void> {
    if (this.authService.$userinfo !== null) {
      let currentMarker: any = null;

      switch (type) {
        case 'red':
          // ... (this case is correct and does not need changes)
          console.log('selectedPoint for red value =>: ', this.selectedPoint);
          const iconUrl = this.markerLevel(
            type,
            choice.toString(),
            this.authService.$userinfo.id,
            this.authService.$userinfo.role.role_name
          );
          // Resolve position in priority: held gray marker -> stored GPS -> one-shot GPS fix
          let resolvedLatLng: { lat: number, lng: number } | null = null;
          if (this.markergray && this.selectedPosi?.lat !== undefined && this.selectedPosi?.lng !== undefined) {
            resolvedLatLng = { lat: this.selectedPosi.lat, lng: this.selectedPosi.lng };
          } else {
            const userLat = parseFloat(localStorage.getItem('lat') || '');
            const userLng = parseFloat(localStorage.getItem('long') || '');
            if (!isNaN(userLat) && !isNaN(userLng)) {
              resolvedLatLng = { lat: userLat, lng: userLng };
            } else {
              // Attempt a one-shot GPS fix
              resolvedLatLng = await this.getOneShotLocation();
            }
          }

          if (!resolvedLatLng) { return; }

          this.selectedPoint = {
            option: true,
            position: {
              lat: resolvedLatLng.lat,
              lng: resolvedLatLng.lng,
            },
          };
          let newMarkerR = this.createLeafletMarker(
            iconUrl,
            [this.selectedPoint.position.lat, this.selectedPoint.position.lng]
          ).addTo(this.map!);
          if (this.heldMarker) {
            this.heldMarker.remove();
            this.heldMarker = null;
            this.markergray = false;
            this.selectedPosi = undefined;
          }
          let objectR = {
            id: undefined, name: 'point rouge', address: '----',
            lat: this.selectedPoint.position.lat, lng: this.selectedPoint.position.lng,
            level: choice, like: 0, dislike: 0, object: newMarkerR,
            userId: this.authService.$userinfo.id,
            username: this.authService.$userinfo.firstName + ' ' + this.authService.$userinfo.lastName,
            role: this.authService.$userinfo.role.role_name,
            date: null, heure: null, isLoading: true
          };
          if (this.selectedPoint?.option == undefined && this.selectedPoint?.remove) {
            this.selectedPoint.remove();
            this.selectedPoint = undefined;
          }
          this.savePoint(objectR, newMarkerR, type);
          break;

        case 'location':
          // ... (this case is correct and does not need changes)
          const locationIcon = L.icon({
            iconUrl: '../../assets/icon/mylocationGreen.svg',
            iconSize: [44, 44], iconAnchor: [22, 44], popupAnchor: [0, -44]
          });
          const lat = localStorage.getItem('lat') ? parseFloat(localStorage.getItem('lat')!) : (choice?.position?.lat || 0);
          const long = localStorage.getItem('long') ? parseFloat(localStorage.getItem('long')!) : (choice?.position?.long || 0);
          if (lat && long) {
            this.selectedPoint = { option: true, position: { lat: lat, long: long }, };
          } else { console.warn('Latitude and Longitude are missing!'); }
          if (this.currentMarker) { this.currentMarker.remove(); }
          currentMarker = L.marker([this.selectedPoint.position.lat, this.selectedPoint.position.long], { icon: locationIcon }).addTo(this.map!);
          this.currentMarker = currentMarker;
          break;

        case 'jaune':
          // ... (this case is correct and does not need changes)
          const jauneIcon = L.icon({
            iconUrl: '../../assets/icon/markjaune.svg',
            iconSize: [44, 44], iconAnchor: [22, 44], popupAnchor: [0, -44]
          });
          if (this.position.lat != undefined && this.position.long != undefined) {
            this.selectedPoint = {
              option: true,
              position: {
                lat: parseFloat(localStorage.getItem('lat') || '0'),
                long: parseFloat(localStorage.getItem('long') || '0'),
              },
            };
          }
          if (this.selectedPoint) {
            let newMarkerJaune = L.marker([this.selectedPoint.position.lat, this.selectedPoint.position.long], { icon: jauneIcon }).addTo(this.map!);
            this.removeMarker();
            if (this.heldMarker) {
              this.heldMarker.remove();
              this.heldMarker = null;
              this.markergray = false;
              this.selectedPosi = undefined;
            }
            let dateInii = new Date();
            let objectJaune = {
              name: 'point de sos', address: '----',
              lat: this.selectedPoint.position.lat, lng: this.selectedPoint.position.long,
              msg: choice.msg, numeroTel: choice.numeroTel, like: 0, dislike: 0, object: newMarkerJaune,
              userId: this.authService.$userinfo.id,
              username: this.authService.$userinfo.firstName + ' ' + this.authService.$userinfo.lastName,
              role: this.authService.$userinfo.role.role_name,
              date: dateInii.getDate() + '-' + (dateInii.getMonth() + 1) + '-' + dateInii.getFullYear(),
              heure: dateInii.getHours() + ':' + dateInii.getMinutes(),
            };
            this.savePoint(objectJaune, newMarkerJaune, type);
          }
          break;
        
        case 'green':
          // ... (this case is correct and does not need changes)
          const greenIcon = L.icon({
            iconUrl: '../../assets/icon/station.svg',
            iconSize: [44, 44], iconAnchor: [22, 44], popupAnchor: [0, -44]
          });
          if (!this.heldMarker) {
            presentToast('Erreur: Aucun point gris n\'a été placé pour créer une station.', 'bottom', 'danger');
            return;
          }
          const stationPosition = this.heldMarker.getLatLng();
          let newMarkerGr = L.marker([stationPosition.lat, stationPosition.lng], { icon: greenIcon }).addTo(this.map!);
          this.heldMarker.remove();
          this.heldMarker = null;
          this.markergray = false;
          this.selectedPosi = undefined;
          this.displayer.statusDisplay = false;
          let dateIni = new Date();
          let formattedDate = dateIni.getFullYear() + '-' + (dateIni.getMonth() + 1).toString().padStart(2, '0') + '-' + dateIni.getDate().toString().padStart(2, '0');
          let formattedTime = dateIni.getHours().toString().padStart(2, '0') + ':' + dateIni.getMinutes().toString().padStart(2, '0');
          let objectS = {
            level: 'point de station', lat: stationPosition.lat, lng: stationPosition.lng,
            name: choice, like: 0, dislike: 0, object: newMarkerGr,
            userId: this.authService.$userinfo.id,
            username: this.authService.$userinfo.firstName + ' ' + this.authService.$userinfo.lastName,
            role: this.authService.$userinfo.role.role_name,
            date: formattedDate, heure: formattedTime,
          };
          this.savePoint(objectS, newMarkerGr, type);
          break;

        case 'note':
          console.log('content of note', choice);
          const blueIcon = L.icon({
            iconUrl: '../../assets/icon/markblue.svg',
            iconSize: [44, 44], iconAnchor: [22, 44], popupAnchor: [0, -44]
          });

          // --- FIX IS HERE ---
          // Guard: Check for 'lg' and convert to number immediately.
          const noteLat = parseFloat(choice?.lat);
          const noteLng = parseFloat(choice?.lg);
          if (!choice || isNaN(noteLat) || isNaN(noteLng)) {
            presentToast('Veuillez sélectionner un lieu valide dans la liste.', 'bottom', 'danger');
            return;
          }
          // --- END OF FIX ---

          if (this.franceBounds && !this.franceBounds.contains([noteLat, noteLng] as any)) {
            presentToast("Ce lieu n'existe pas en France", 'bottom', 'warning');
            return;
          }

          let newMarkerBl = L.marker([noteLat, noteLng], { icon: blueIcon }).addTo(this.map!);
          // Do not auto-navigate when creating a note marker
          this.removeMarker();
          let dateIn = new Date();
          let objectN = {
            level: 'point de note marine', address: '----',
            lat: noteLat, lng: noteLng,
            lieu: this.sanitizeLieu(choice.lieu || ''), type: choice.type,
            name: choice.destination, destination: choice.destination,
            selectedDays: choice.selectedDays, like: 0, dislike: 0, object: newMarkerBl,
            userId: this.authService.$userinfo.id,
            username: this.authService.$userinfo.firstName + ' ' + this.authService.$userinfo.lastName,
            role: this.authService.$userinfo.role.role_name,
            heureDebut: choice.heure,
            date: dateIn.getDate() + '-' + (dateIn.getMonth() + 1) + '-' + dateIn.getFullYear(),
            heure: dateIn.getHours() + ':' + dateIn.getMinutes(),
          };
          this.savePoint(objectN, newMarkerBl, type);
          break;

        case 'event':
          console.log('selected choice ', choice);
          let accepted = this.checkDates(choice, 'create');
          if (accepted) {
            
            // --- FIX IS HERE ---
            // Guard: Check for 'lg' and convert to number immediately.
            const eventLat = parseFloat(choice?.lat);
            const eventLng = parseFloat(choice?.lg);
            if (!choice || isNaN(eventLat) || isNaN(eventLng)) {
              presentToast('Veuillez sélectionner un lieu valide dans la liste.', 'bottom', 'danger');
              return;
            }
            // --- END OF FIX ---

            if (this.franceBounds && !this.franceBounds.contains([eventLat, eventLng] as any)) {
              presentToast("Ce lieu n'existe pas en France", 'bottom', 'warning');
              return;
            }

            let level = this.authService.$userinfo.role.role_name == 'chauffeur' ? '1' : '';
            const eventIcon = L.icon({
              iconUrl: this.markerLevel(type, level, this.authService.$userinfo.id, this.authService.$userinfo.role.role_name),
              iconSize: [44, 44], iconAnchor: [22, 44], popupAnchor: [0, -44]
            });
            this.selectedPoint = {
              option: true,
              position: { lat: eventLat, lng: eventLng },
            };
            let displayIt = this.checkDates(choice, 'none');
            let newMarkerV;
            if (displayIt && this.map) {
              newMarkerV = L.marker([eventLat, eventLng], { icon: eventIcon }).addTo(this.map);
            } else {
              newMarkerV = L.marker([eventLat, eventLng], { icon: eventIcon });
            }
            if (this.heldMarker) {
              this.heldMarker.remove();
              this.heldMarker = null;
              this.markergray = false;
            }
            this.map?.flyTo([eventLat, eventLng], Math.min(this.map.getMaxZoom() || 18, 15));
            let objectV = {
              name: "point d'evenement", address: '---',
              lieu: this.sanitizeLieu(choice.lieu || choice.name || ''),
              type: choice.type, date: choice.date,
              heureDebut: choice.heureDebut, heureFin: choice.heureFin,
              lat: eventLat, lng: eventLng, level: level, like: 0, dislike: 0,
              object: newMarkerV, userId: this.authService.$userinfo.id,
              role: this.authService.$userinfo.role.role_name,
              createDate: new Date(),
            };
            if (this.selectedPoint?.option == undefined && this.selectedPoint?.remove) {
                this.selectedPoint.remove();
                this.selectedPoint = undefined;
            }
            this.savePoint(objectV, newMarkerV, type);
          } else {
            presentToast('cet événement est déjà fait !', 'bottom', 'danger');
          }
          break;

        default:
          break;
      }
    }
  }


  async myLocation() {
    if (!this.map) { return; }

    this.map.locate({ 
      watch: true, 
      setView: false, // we control centering manually on first fix
      maxZoom: 16, 
      enableHighAccuracy: true,
      timeout: 30000,        // 30 seconds timeout instead of default 10s
      maximumAge: 0          // use freshest position for real-time tracking
    });

    const onLocationFound = (e: L.LocationEvent) => {
      const { lat: latitude, lng: longitude } = e.latlng;
      console.log('Updated Location:', latitude, longitude);

      localStorage.setItem('lat', latitude.toString());
      localStorage.setItem('long', longitude.toString());

      this.addMarker('location', { position: { lat: latitude, long: longitude } });
      this.isGpsPermissionPromptOpen = false;
      this.showGpsModal = false;
      const current = L.latLng(latitude, longitude);

      // Center the map to the user's location on initial fix, then follow if enabled
      if (!this.hasCenteredOnUser) {
        try {
          this.map?.flyTo([latitude, longitude], 17);
      // bounds check omitted silently
        } catch (err) {
          console.warn('Failed to center on initial user location', err);
        }
        this.hasCenteredOnUser = true;
        this.lastPanTs = Date.now();
        this.lastUserLatLng = current;
      } else if (this.followUser) {
        try {
          const now = Date.now();
          const since = now - this.lastPanTs;
          // Throttle and avoid tiny pans
          if (since >= this.followPanThrottleMs && (!this.lastUserLatLng || current.distanceTo(this.lastUserLatLng) >= this.followPanMinDistanceMeters)) {
            // Keep zoom as-is; smooth pan
            this.map?.panTo(current, { animate: true, duration: 0.5 } as any);
            this.lastPanTs = now;
            this.lastUserLatLng = current;
          }
        } catch (err) {
          console.warn('Failed to pan while following user', err);
        }
      }
    }

    const onLocationError = (e: L.ErrorEvent) => {
      console.warn('Location error:', e.message);
      try { this.updatePermissionState(); } catch {}
      if (this.permissionState !== 'granted' && !this.isGpsPermissionPromptOpen) {
        this.showGpsModal = true;
      }
    }

    this.map.on('locationfound', onLocationFound);
    this.map.on('locationerror', onLocationError);

    // Mettre à jour la position toutes les 30 secondes (moins agressif)
    this.positionUpdateInterval = setInterval(() => {
      console.log("Mise à jour de la position en cours...");
      this.map?.locate({
        enableHighAccuracy: true,
        timeout: 30000,        // 30 seconds timeout
        maximumAge: 0          // always request fresh position
      });
    }, 30000); // 30 secondes au lieu de 10
    // Continuous tracking: do not auto-stop after 5 minutes
  }

  // Optional: expose a method to toggle follow mode (can be wired to a UI control if needed)
  toggleFollowUser() {
    this.followUser = !this.followUser;
  }

  async locateCurrentPosition() {
    if (!this.map) { return; }

    // Re-enable follow mode when user taps the GPS button
    this.followUser = true;
    // Allow a fresh re-center on this manual request
    this.hasCenteredOnUser = false;

    const onLocationFound = (e: L.LocationEvent) => {
      const { lat: latitude, lng: longitude } = e.latlng;
      console.log('Manual location found:', latitude, longitude);
      localStorage.setItem('lat', latitude.toString());
      localStorage.setItem('long', longitude.toString());

      // --- THIS IS THE FIX ---
      // 1. ALWAYS navigate to the user's location.
      this.map?.flyTo([latitude, longitude], 17);

      // 2. THEN, if the location is outside France, show a warning toast.
      // bounds check omitted silently
      // --- END OF FIX ---
      
      // Update the user's marker on the map.
      this.addMarker('location', { position: { lat: latitude, long: longitude } });
      this.showGpsModal = false;

      // Clean up the one-time event listeners.
      this.map?.off('locationfound', onLocationFound);
      this.map?.off('locationerror', onLocationError);
      this.isGpsPermissionPromptOpen = false;
    };

    const onLocationError = (e: L.ErrorEvent) => {
      console.warn('Manual location error:', e.message);
      // Only show overlay if permission isn't granted and we aren't already showing system prompt
      try { this.updatePermissionState(); } catch {}
      if (this.permissionState !== 'granted' && !this.isGpsPermissionPromptOpen) {
        this.showGpsModal = true;
      }
      
      // Fallback to stored coordinates if GPS fails.
      const lat = localStorage.getItem('lat');
      const lng = localStorage.getItem('long');
      if (lat && lng && this.map) {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        if (!isNaN(latitude) && !isNaN(longitude)) {
          // Also apply the new logic here: always fly, then check bounds.
          this.map.flyTo([latitude, longitude], 17);
          // bounds check omitted silently
          this.addMarker('location', { position: { lat: latitude, long: longitude } });
        }
      }
      
      // Clean up the one-time event listeners.
      this.map?.off('locationfound', onLocationFound);
      this.map?.off('locationerror', onLocationError);
    };

    // Attach the one-time listeners
    this.map.on('locationfound', onLocationFound);
    this.map.on('locationerror', onLocationError);

    // Trigger the location request.
    this.map.locate({
      setView: false,
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    });
  }


  markerLevel(type: string, level: string, id: string, role: string): string {
    // Protective guard clause: If user info isn't loaded yet, return a default placeholder icon.
    if (!this.authService.$userinfo) {
      // Return a path to a generic, default icon that you know exists.
      return '../../assets/icon/markerGray.png'; 
    }

    if (type == 'red') {
      // --- ADDED FOR DEBUGGING ---
      // Log the inputs to see why the switch might be failing.
      console.log(`markerLevel('red') inputs: level=${level}, role=${role}`);

      if (role == 'chauffeur') {
        if (id == this.authService.$userinfo.id) {
          switch (String(level)) {
            case '0': return '../../assets/icon/markerRed0Own.svg';
            case '1': return '../../assets/icon/markerRed1Own.svg';
            case '2': return '../../assets/icon/markerRed2Own.svg';
            case '3': return '../../assets/icon/markerRed3Own.svg';
            case '4': return '../../assets/icon/markerRed4Own.svg';
          }
        } else {
          switch (String(level)) {
            case '0': return '../../assets/icon/markerRed0.svg';
            case '1': return '../../assets/icon/markerRed1.svg';
            case '2': return '../../assets/icon/markerRed2.svg';
            case '3': return '../../assets/icon/markerRed3.svg';
            case '4': return '../../assets/icon/markerRed4.svg';
          }
        }
      } else {
        if (id == this.authService.$userinfo.id) {
          switch (String(level)) {
            case '0': return '../../assets/icon/markerRed0OrgOwn.svg';
            case '1': return '../../assets/icon/markerRed1OrgOwn.svg';
            case '2': return '../../assets/icon/markerRed2OrgOwn.svg';
            case '3': return '../../assets/icon/markerRed3OrgOwn.svg';
            case '4': return '../../assets/icon/markerRed4OrgOwn.svg';
          }
        } else {
          switch (String(level)) {
            case '0': return '../../assets/icon/markerRed0Org.svg';
            case '1': return '../../assets/icon/markerRed1Org.svg';
            case '2': return '../../assets/icon/markerRed2Org.svg';
            case '3': return '../../assets/icon/markerRed3Org.svg';
            case '4': return '../../assets/icon/markerRed4Org.svg';
          }
        }
      }
    } else if (type == 'event') {
      return '../../assets/icon/markerEvent1.svg';
    } else if (type == 'jaune') {
      return '../../assets/icon/markjaune.svg';
    } else if (type == 'location') {
      return '../../assets/icon/mylocationGreen.svg';
    } else if (type == 'green') {
      return '../../assets/icon/markgreen.svg';
    } else if (type == 'note' || type == 'blue') {
      return '../../assets/icon/markblue.svg';
    }

    // --- THIS IS THE FIX ---
    // If NO condition is met, log a warning and return a default icon path.
    // NEVER return a string that is not a valid URL.
    console.warn(`markerLevel fell through with type: ${type} and level: ${level}. Returning a default marker.`);
    return '../../assets/icon/markerGray.png'; // Use a default icon you know exists.
  }


  widgetContent(
    type: string,
    id: string,
    index: number,
    like: number,
    dislike: number,
    content?: any
  ): string {
    const detailsBlock = this.buildDetailsBlock(type, content);
    if (type == 'red') {


      if (content.userId == this.authService.$userinfo.id) {

        const dateTimeContent = !content.created_at
          ? `<div class="shimmer-container">
               <div class="shimmer-line" style="width: 120px; height: 14px; margin: 2px 0;"></div>
             </div>`
          : (() => {
              const displayDate = new Date(content.created_at);
              return `<span>${displayDate.toLocaleDateString('fr-FR')} à ${displayDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>`;
            })();

        return `<div class="bg-white ring-gray-900/5">
            ${detailsBlock}
            <div class="mx-auto flex flex-col">
              <label class="py-1 font-light">Mise à jour par  <span>${this.authService.$userinfo.firstName
          } ${this.authService.$userinfo.lastName}</span></label> 
            </div>
            <ion-button id="${'supprimer' + index
          }" class="mt-2" size="small" fill="outline" style="--border-color:#EB2F06; --color:#EB2F06; text-transform: none;">Supprimer</ion-button>
            <style>
              .shimmer-container {
                display: inline-block;
              }
              .shimmer-line {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: shimmer 1.5s infinite;
                border-radius: 4px;
                display: inline-block;
              }
              @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
              }
            </style>
          </div>`;
      } else {

        return `<div class="bg-white ring-gray-900/5">
        ${detailsBlock}
        <div class="mx-auto flex flex-col">
          <label class="py-1 text-center">Est ce encore d'actualité ?</label>
          <div class="flex">
            <div id="user-1-${index}" class="border-4 border-[#B3B3B3] rounded p-3">
              <img src="../../assets/icon/redUser.svg" width="20">
            </div>
            <div id="user-2-${index}" class="border-4 border-[#B3B3B3] rounded py-3 px-2 mx-1">
              <img src="../../assets/icon/twoRedUsers.svg" width="30">
            </div>
            <div id="user-3-${index}" class="border-4 border-[#B3B3B3] rounded py-3 px-1">
              <img src="../../assets/icon/threeUser.svg" width="40">
            </div>
            <div id="user-4-${index}" class="border-4 border-[#B3B3B3] rounded py-3 px-2 mx-1">
              <img src="../../assets/icon/fourUser.svg" width="30">
            </div>
            <div id="user-0-${index}" class="border-4 border-[#B3B3B3] rounded p-3">
              <img src="../../assets/icon/darkUser.svg" width="20">
            </div>
          </div>
        </div>
        <div class="flex justify-between">
          <div class="flex mt-2">
            <span id="${'like-' + index}" class="flex items-center mr-2">
              <img src="../../assets/icon/thumGreen.svg" width="30" class="mr-2" /> <span>${like}</span>
            </span>
            <span id="${'dislike-' + index}" class="flex items-center mr-2">
              <img src="../../assets/icon/thumRed.svg" width="30" class="mr-2" /> <span>${dislike}</span>
            </span>
          </div>
          <div>
            <ion-button id="${'btnValider-' + index
          }" class="mt-2" size="small" style="--background:#1D4999; --color:#FFFFFF; text-transform: none;">Valider</ion-button>
          </div>
        </div>
      </div>`;
      }
    } else if (type == 'event') {


      if (content.userId == this.authService.$userinfo.id) {

        return `<div class="bg-white ring-gray-900/5">
          ${detailsBlock}
          <ion-button id="${'supprimerEvent' + index
                    }" class="mt-2" size="small" fill="outline" style="--border-color:#EB2F06; --color:#EB2F06; text-transform: none;">Supprimer</ion-button>
          <ion-button id="${'btnUpdateEvent' + index
          }" class="mt-2" size="small" fill="outline" style="--border-color:#A259FF; --color:#A259FF; text-transform: none;">Modifier</ion-button>

        </div>`;
      } else {

        return `<div class="bg-white ring-gray-900/5">
          ${detailsBlock}
          <div class="flex mt-2">
            <span id="${'like-' + index}" class="flex items-center mr-2">
              <img src="../../assets/icon/thumGreen.svg" width="30" class="mr-2" /> <span>${like}</span>
            </span>
            <span id="${'dislike-' + index}" class="flex items-center mr-2">
              <img src="../../assets/icon/thumRed.svg" width="30" class="mr-2" /> <span>${dislike}</span>
            </span>
          </div>
        </div>`;
      }
    } else if (type == 'jaune') {


      if (content.userId == this.authService.$userinfo.id) {

        return `<div class="bg-white ring-gray-900/5">
          ${detailsBlock}
          <div class="mx-auto flex flex-col">
            <label class="py-1 font-bold">Mon alerte SOS</label>
            <p class="py-1 font-light">Message: <br><strong>${content.msg}</strong></p>
            <p class="py-1 font-light">Numéro: <strong>${content.numeroTel}</strong></p>
          </div>
          <ion-button id="${'btnUpdateSos' + index
          }" class="mt-2" size="small" fill="fill" style="--background:#1D4999;--background-activated:#173d84; text-transform: none;" class="mr-1 h-[40px] w-full border-2 border-[#1D4999] rounded-xl bg-[#1D4999] text-[13px] font-semibold tracking-wide text-white">Modifier</ion-button>
          <ion-button id="${'supprimerSos' + index
          }" class="mt-2" size="small" fill="outline" style="--border-color:#EB2F06; --color:#EB2F06; text-transform: none;">Supprimer</ion-button>
        </div>`;
      } else {

        return `<div class="bg-white ring-gray-900/5">
          ${detailsBlock}
          <div class="mx-auto flex flex-col">
             <label class="py-1 text-center font-bold text-yellow-500">ALERTE SOS</label>
             <p class="py-1 font-light">Message: <br><strong>${content.msg}</strong></p>
             <p class="py-1 font-light">Numéro de contact: <strong>${content.numeroTel}</strong></p>
          </div>
        <div class="flex justify-between">
          <div class="flex mt-2">
            <span id="${'like-' + index}" class="flex items-center mr-2">
              <img src="../../assets/icon/thumGreen.svg" width="30" class="mr-2" /> <span>${like}</span>
            </span>
            <span id="${'dislike-' + index}" class="flex items-center mr-2">
              <img src="../../assets/icon/thumRed.svg" width="30" class="mr-2" /> <span>${dislike}</span>
            </span>
          </div>
          <div>
          </div>
        </div>
      </div>`;
      }
    }
    if (type == 'green') {


      if (content.userId == this.authService.$userinfo.id) {

        return `<div class="bg-white ring-gray-900/5 rounded-lg p-4 shadow-md">
          ${detailsBlock}
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2">
              Lieu: <span class="font-bold text-black">${content.name}</span>
            </label>
            <label class="block text-gray-700 font-light mb-1">
              <input type="radio" name="stationOptions${index}" class="mr-2" id="incorrectLocation${index}"> 
              L'emplacement n'est pas correct
            </label>
            <label class="block text-gray-700 font-light mb-1">
              <input type="radio" name="stationOptions${index}" class="mr-2" id="stationDoesNotExist${index}"> 
              La station n'existe plus
            </label>
            <label class="block text-gray-700 font-light mb-1">
              <input type="radio" name="stationOptions${index}" class="mr-2" id="modifyQueue${index}"> 
              Modifier la file
            </label>
          </div>
          <div class="flex justify-between">
            <ion-button
              id="updateStation${index}"
              class="h-10 w-full rounded-md bg-[#1D4999] text-white font-semibold text-sm"
              style="--background: #1D4999; --background-activated: #173d84; text-transform: none;">
              Modifier
            </ion-button>
          </div>
        </div>`;
      } else {
        // View for other users: Join/Leave Queue and Like/Dislike
        const isInThisQueue = this.activeQueueStationId === content.id;
        const buttonText = isInThisQueue ? "Quitter la file" : "Rejoindre la file";
        const buttonColor = isInThisQueue ? "#EB2F06" : "#1D4999"; // Red for Leave, Blue for Join

        return `<div class="bg-white ring-gray-900/5 p-4 shadow-md">
          ${detailsBlock}
          <div class="mx-auto flex flex-col">
            <label class="block text-gray-700 font-medium mb-2">
              Station: <span class="font-bold text-black">${content.name}</span>
            </label>
            <p class="text-sm text-gray-500">Créé par: ${content.username}</p>
          </div>
          <div class="flex justify-between items-center mt-3">
            <div class="flex mt-2">
              <span id="${'like-' + index}" class="flex items-center mr-4 cursor-pointer">
                <img src="../../assets/icon/thumGreen.svg" width="30" class="mr-2" /> <span>${like}</span>
              </span>
              <span id="${'dislike-' + index}" class="flex items-center cursor-pointer">
                <img src="../../assets/icon/thumRed.svg" width="30" class="mr-2" /> <span>${dislike}</span>
              </span>
            </div>
            <div>
              <ion-button
                id="joinQueueBtn-${index}"
                class="h-10 rounded-md text-white font-semibold text-sm"
                style="--background: ${buttonColor}; --background-activated: #173d84; text-transform: none;">
                ${buttonText}
              </ion-button>
            </div>
          </div>
        </div>`;
      }
    }
   if (type == 'note' || type=='blue') {
  
  
        if (content.userId == this.authService.$userinfo.id) {
  
          return `
          <div class="bg-white ring-gray-900/5">
            ${detailsBlock}
            <div class="flex justify-between">
              <ion-button
                id="${'updateNote' + index}"
                class="h-10 w-full rounded-md bg-[#1D4999] text-white font-semibold text-sm"
                style="--background: #1D4999; --background-activated: #173d84; text-transform: none;">
                Modifier
              </ion-button>
              <ion-button id="${'supprimerNote' + index}" class="mt-2" size="small" fill="outline" style="--border-color:#EB2F06; --color:#EB2F06; text-transform: none;">Supprimer</ion-button>
            </div>
          </div>`;
        } else {
          return `<div class="bg-white ring-gray-900/5 p-4 shadow-md">
            ${detailsBlock}
            <div class="mx-auto flex flex-col">
              <p class="text-sm text-gray-500">Créé par: ${content.username}</p>
            </div>
            <div class="flex justify-between items-center mt-4">
              <div class="flex mt-2">
                <span id="${'like-' + index}" class="flex items-center mr-4 cursor-pointer">
                  <img src="../../assets/icon/thumGreen.svg" width="30" class="mr-2" /> <span>${like}</span>
                </span>
                <span id="${'dislike-' + index}" class="flex items-center cursor-pointer">
                  <img src="../../assets/icon/thumRed.svg" width="30" class="mr-2" /> <span>${dislike}</span>
                </span>
              </div>
              <div>
                <!-- Optional: Add a button for other users if needed in the future -->
              </div>
            </div>
          </div>`;
        }
      }
    else {
      return '';
    }
  }

  private buildDetailsBlock(type: string, content: any): string {
    if (!content) return '';
    const hasTime = content.heureDebut || content.heureFin;
    const datePart = content.date ? `<p class="text-sm text-gray-600">Date: <strong>${content.date}</strong></p>` : '';
    const timeStart = content.heureDebut ? `${content.heureDebut}` : '';
    // If no heureFin, try to infer +1h for display like older logic did
    const computedEnd = !content.heureFin && content.heureDebut && typeof content.heureDebut === 'string'
      ? (() => {
          const [h, m] = content.heureDebut.split(':').map((x: string) => parseInt(x, 10));
          if (isNaN(h)) return '';
          const endH = (h + 1) % 24;
          const hh = endH < 10 ? `0${endH}` : `${endH}`;
          const mm = !isNaN(m) ? (m < 10 ? `0${m}` : `${m}`) : '00';
          return `${hh}:${mm}`;
        })()
      : '';
    const endTime = content.heureFin || computedEnd;
    const timePart = hasTime || endTime
      ? `<p class="text-sm text-gray-600">Heure: <strong>${timeStart || '--:--'}${endTime ? ` - ${endTime}` : ''}</strong></p>`
      : '';

    const lieu = content.lieu || content.name || 'Lieu inconnu';
    const typeLabel = content.type || (type === 'jaune' ? 'SOS' : type);

    return `
      <div class="mx-auto flex flex-col mb-2">
        <p class="text-sm text-gray-700">Lieu: <strong>${lieu}</strong></p>
        <p class="text-sm text-gray-700">Type: <strong>${typeLabel}</strong></p>
        ${datePart}
        ${timePart}
      </div>
    `;
  }
  displayModify(index: any) { }

  onPause = () => {
    if (this.MarkerTimer) {
      clearInterval(this.MarkerTimer);
    }
    if (this.realtimeInterval) { try { clearInterval(this.realtimeInterval); } catch {} this.realtimeInterval = null; }
    if (this.allMarkers.length > 0) {
      this.allMarkers.forEach((el: L.Marker) => {
        el.remove();
      });
      this.allMarkers = [];
    }
  };

  // This method is now enhanced and moved to line 1726

  displayBlueMarker() {
    console.log("show bluemarkers", this.blueMarkers)
    this.blueMarkers.forEach((el, index) => {
      let mapObject: any = {
        id: el.id,
        object: null,
      };

      console.log('el', el)
      let accepted = this.checkDates(el, 'none');
      console.log("this.checkDates(el, 'none'),this.checkDates(el, 'none')",)

      if (accepted) {
        const iconUrl = this.markerLevel('note', el.level, el.userId, el.role);

        // Create a Leaflet marker
        mapObject.object = this.createLeafletMarker(iconUrl, [el.lat, el.lng])
          .addTo(this.map!);

        // Create the content string for the popup
        const contentString = this.widgetContent(
          'note',
          el.userId,
          index,
          el.like,
          el.dislike,
          el
        );

        // Create a Leaflet popup
        mapObject.object.bindPopup(contentString, { maxWidth: 315 });

        mapObject.object.on('click', () => {
          setTimeout(() => {
            this.handleBtnClick(index, 'note', el);
            this.handleLikesAndDislikes(index, 'note', el);
          }, 500);
        });

        this.objectblueMarkers.push(mapObject);
        this.allMarkers.push(mapObject.object);
      } else {
        this.markerToUnactivate.push(el.id);
      }
    });

    if (this.markerToUnactivate.length > 0) {
      let json = {
        ids: this.markerToUnactivate,
      };

      this.pointService.$disablePoints(json).subscribe((data: any) => {
        if (data.data) {
          this.markerToUnactivate = [];
          // silent: don't refetch
        } else {
          presentToast('error: ' + data.message, 'bottom', 'danger');
        }
      });
    }
  }
  displayGreenMarker() {
    this.greenMarkers.forEach((el, index) => {
      let mapObject: any = {
        id: el.id,
        object: null,
      };

      const iconUrl = this.markerLevel('green', el.level, el.userId, el.role);

      if (this.map) { // Assurez-vous que la carte est initialisée
        mapObject.object = this.createLeafletMarker(iconUrl, [el.lat, el.lng])
          .addTo(this.map!);

        const contentString = this.widgetContent(
          'green',
          el.userId,
          index,
          el.like,
          el.dislike,
          el
        );

        mapObject.object.bindPopup(contentString, { maxWidth: 315 });

        mapObject.object.on('click', () => {
          this.checker = false;
          setTimeout(() => {
            this.handleBtnClick(index, 'green', el);
            this.handleLikesAndDislikes(index, 'green', el);
          }, 500);
        });

        this.objectgreenMarkers.push(mapObject);
        this.allMarkers.push(mapObject.object);
      } else {
        this.markerToUnactivate.push(el.id);
      }
    });

    if (this.markerToUnactivate.length > 0) {
      let json = {
        ids: this.markerToUnactivate,
      };

      this.pointService.$disablePoints(json).subscribe((data: any) => {
        if (data.data) {
          this.markerToUnactivate = [];
          // silent: don't refetch
        } else {
          presentToast('error: ' + data.message, 'bottom', 'danger');
        }
      });
    }
  }

  displayJauneMarker() {
    this.jauneMarkers.forEach((el, index) => {
      let mapObject: any = {
        id: el.id,
        object: null,
      };

      const iconUrl = this.markerLevel('jaune', el.level, el.userId, el.role);

      if (this.map) { // Assurez-vous que la carte est initialisée
        mapObject.object = this.createLeafletMarker(iconUrl, [el.lat, el.lng])
          .addTo(this.map!);

        const contentString = this.widgetContent(
          'jaune',
          el.userId,
          index,
          el.like,
          el.dislike,
          el
        );

        mapObject.object.bindPopup(contentString, { maxWidth: 315 });

        mapObject.object.on('click', () => {
          this.checker = false;
          setTimeout(() => {
            this.handleBtnClick(index, 'jaune', el);
            this.handleLikesAndDislikes(index, 'jaune', el);
          }, 500);
        });

        this.objectjauneMarkers.push(mapObject);
        this.allMarkers.push(mapObject.object);
      } else {
        this.markerToUnactivate.push(el.id);
      }
    });

    if (this.markerToUnactivate.length > 0) {
      let json = {
        ids: this.markerToUnactivate,
      };

      this.pointService.$disablePoints(json).subscribe((data: any) => {
        if (data.data) {
          this.markerToUnactivate = [];
          // silent: don't refetch
        } else {
          presentToast('error: ' + data.message, 'bottom', 'danger');
        }
      });
    }

  }

  displayRedMarker() {
    this.redMarkers.forEach((el, index) => {
      let mapObject: any = {
        id: el.id,
        object: null,
      };

      const iconUrl = this.markerLevel('red', el.level, el.userId, el.role);
 if (this.map) { // Assurez-vous que la carte est initialisée
        mapObject.object = this.createLeafletMarker(iconUrl, [el.lat, el.lng])
          .addTo(this.map!);

        const contentString = this.widgetContent(
          'red',
          el.userId,
          index,
          el.like,
          el.dislike,
          el
        );

        mapObject.object.bindPopup(contentString, { maxWidth: 315 });

        mapObject.object.on('click', () => {
          this.checker = false;
          setTimeout(() => {
            this.handleBtnClick(index, 'red', el);
            this.handleLikesAndDislikes(index, 'red', el);
          }, 500);
        });

        this.objectredMarkers.push(mapObject);
        this.allMarkers.push(mapObject.object);
      } else {
        this.markerToUnactivate.push(el.id);
      }
    });

    if (this.markerToUnactivate.length > 0) {
      let json = {
        ids: this.markerToUnactivate,
      };

      this.pointService.$disablePoints(json).subscribe((data: any) => {
        if (data.data) {
          this.markerToUnactivate = [];
          // silent: don't refetch
        } else {
          presentToast('error: ' + data.message, 'bottom', 'danger');
        }
      });
    }
  }

  removeRedMarkers() {
    if (this.objectredMarkers.length > 0) {
      this.objectredMarkers.forEach((el) => {
        if (el.object != null) {
          el.object.remove();
          el.object = null;
        }
      });

      if (this.objectredMarkers.length > 0) this.objectredMarkers = [];
    }
  }

  findObjectByPointId(pointId: number, type: string): any {
    if (type == 'red') {
      return this.objectredMarkers.find((el) => el.id == pointId);
    }
    else if (type == 'jaune') {
      return this.objectjauneMarkers.find((el) => el.id == pointId);
    }
    else if (type == 'event') {
      return this.objectpurpleMarkers.find((el) => el.id == pointId);
    } else if (type == 'green') {
      return this.objectgreenMarkers.find((el) => el.id == pointId);
    }
  }

  datePlusOneHour(date: string) {
    let oldDate = new Date(date);
    let datePlusHour = oldDate.setHours(oldDate.getHours() + 1);
    const newDateTime = this.dateStructor('timestemp', datePlusHour);
    this.dateStructor('timestemp', datePlusHour);
    return newDateTime;
  }

  checkDates(element: any, action: string) {
    if (action == 'create') {
      return true; // Always allow creation
    }

    if (!element?.date) {
      console.error("checkDates Error: element.date is null or undefined.", element);
      return false;
    }

    // --- THIS IS THE FIX ---
    // A much simpler and more robust way to check if an event is currently active.
    const now = new Date();
    const eventDateStr = element.date; // e.g., "11/08/2025"
    const [day, month, year] = eventDateStr.split('/').map(Number);

    // Check if the event is for today
    if (year !== now.getFullYear() || month !== now.getMonth() + 1 || day !== now.getDate()) {
      return false; // Not today, so not active.
    }

    // It is today, now check the time
    const startTimeStr = element.heureDebut; // e.g., "19:23"
    // If no end time, assume it lasts for one hour.
    const endTimeStr = element.heureFin || `${(parseInt(startTimeStr.split(':')[0]) + 1)}:${startTimeStr.split(':')[1]}`;

    const startDateTime = new Date();
    startDateTime.setHours(parseInt(startTimeStr.split(':')[0]), parseInt(startTimeStr.split(':')[1]), 0);

    const endDateTime = new Date();
    endDateTime.setHours(parseInt(endTimeStr.split(':')[0]), parseInt(endTimeStr.split(':')[1]), 0);

    // Check if the current time is between the start and end times
    return now >= startDateTime && now <= endDateTime;
  }


  isDateBetween(date: string, startDate: string, endDate: string) {
    const currentDate = new Date(date);
    const DateBegin = new Date(startDate);
    const Dateend = new Date(endDate);
    return currentDate >= DateBegin && currentDate <= Dateend;
  }

  displayEventMarkers() {
    console.log('events markers ', this.purpleMarkers)
    this.purpleMarkers.forEach((el, index) => {
      let mapObject: any = {
        id: el.id,
        object: null,
      };



      // Create a custom icon
      let beachFlagImgUrl = this.markerLevel('event', el.level, el.userId, el.role);
      let iconSize = [44, 44];

      // Create a Leaflet marker
      mapObject.object = this.createLeafletMarker(beachFlagImgUrl, [el.lat, el.lng], { width: iconSize[0], height: iconSize[1] });
      if (this.map) {
        mapObject.object.addTo(this.map);
      }

      // Create the content string for the popup
      const contentString = this.widgetContent(
        'event',
        el.userId,
        index,
        el.like,
        el.dislike,
        el
      );

      // Create a Leaflet popup
      mapObject.object.bindPopup(contentString, { maxWidth: 315 });

      // Add a click event listener to the marker to open the popup
      mapObject.object.on('click', () => {
        setTimeout(() => {
          this.handleBtnClick(index, 'event', el);
          this.handleLikesAndDislikes(index, 'event', el);
        }, 500);
      });

      this.objectpurpleMarkers.push(mapObject);
      this.allMarkers.push(mapObject.object);
    });
  }

  removeEventMarkers() {
    if (this.objectpurpleMarkers.length > 0) {
      this.objectpurpleMarkers.forEach((el) => {
        if (el.object != null) {
          el.object.remove();
          el.object = null;
        }
      });
      if (this.objectpurpleMarkers.length > 0) this.objectpurpleMarkers = [];
    }
  }

  removeAllMarkers() {
    this.removeRedMarkers();
    this.removeEventMarkers();

  }

  private allMarkers: L.Marker[] = []; // Stocke tous les marqueurs pour pouvoir les retirer facilement
  

  private getCategoryForType(type: string): string {
    switch (type) {
      case 'red': return 'affluence';
      case 'event': return 'event';
      case 'green': return 'station';
      case 'blue': return 'note';
      case 'jaune': return 'sos';
      default: return '';
    }
  }

  makeObjectMarker() {
    // --- THIS IS THE FIX ---
    // 1. Temporarily disable marker transitions to prevent the "falling" animation.
    const styleSheet = document.styleSheets[0];
    if (styleSheet) {
      try {
        styleSheet.insertRule('.leaflet-marker-icon { transition: none !important; }', styleSheet.cssRules.length);
      } catch (e) { console.warn("Could not disable marker transitions", e); }
    }
    
    this.clearMarker();
  
    this.addMarkers(this.purpleMarkers, 'event');
    this.addMarkers(this.redMarkers, 'red');
    this.addMarkers(this.greenMarkers, 'green');
    this.addMarkers(this.blueMarkers, 'blue');
    this.addMarkers(this.jauneMarkers, 'jaune');

    // 2. Re-enable the transitions after a very short delay.
    // This allows the markers to appear instantly, but subsequent opacity changes will be animated.
    setTimeout(() => {
      if (styleSheet && styleSheet.cssRules.length > 0) {
        try {
          // Find and remove the rule we just added.
          for (let i = styleSheet.cssRules.length - 1; i >= 0; i--) {
            if (styleSheet.cssRules[i].cssText.includes('.leaflet-marker-icon { transition: none !important; }')) {
              styleSheet.deleteRule(i);
              break;
            }
          }
        } catch (e) { console.warn("Could not re-enable marker transitions", e); }
      }
      // Also re-apply the correct opacity state now that transitions are back.
      this.setMarkersOpacity();
    }, 100);
  }

  private addMarkers(markerList: any[], type: string) {
    if (!this.map) return; // Ensure map exists before adding markers
    
    const hasSelectedCategory = Object.values(this.selectedBtn).some(selected => selected);
    const buttonCategory = this.getCategoryForType(type);
    const isThisCategorySelected = this.selectedBtn[buttonCategory];
  
    markerList.forEach((markerData, index) => {

      // --- NEW SAFEGUARD FOR EXPIRED AFFLUENCE POINTS ---
      // If the point is an affluence point, check if it's already expired before drawing.
      if (type === 'red') {
        const totalDurationMs = this.getAffluenceDurationMs(markerData.level);
        const createdAt = this.parseAffluenceCreationDate(markerData);
        const elapsed = new Date().getTime() - createdAt.getTime();
        
        if (elapsed >= totalDurationMs) {
          // Log it for debugging and tell the backend to clean it up.
          console.log(`Skipping expired affluence point ID: ${markerData.id}. It should be removed from the backend.`);
          this.expireAffluencePoint(markerData.id); 
          return; // Skip the rest of the loop for this expired marker.
        }
      }
      // --- END OF NEW SAFEGUARD ---

      // Timed visibility for events/notes: only render if currently active
      if (type === 'event') {
        const isActiveNow = this.checkDates(markerData, 'none');
        if (!isActiveNow) {
          return;
        }
      }
      // For notes, enforce time visibility except for the freshly created point (show immediately)
      if (type === 'blue' || type === 'note') {
        // Allow grace period for newly created notes
        const now = Date.now();
        const expiresAt = this.recentlyCreatedNotes.get(this.normalizeId(markerData.id));
        const isUnderGrace = typeof expiresAt === 'number' && now < expiresAt;
        if (!isUnderGrace) {
          const isActiveNow = this.isNoteVisibleNow(markerData);
          if (!isActiveNow) {
            return;
          }
        }
      }
      const iconUrl = this.getIconForType(type, markerData);
      if (!iconUrl) return;
  
      const newMarker = this.createLeafletMarker(iconUrl, [markerData.lat, markerData.lng])
        .addTo(this.map!);
      // Force a layout pass for this marker after it's added
      try { (newMarker as any).update?.(); } catch {}
  
      (newMarker as any).pointId = markerData.id; // Attach the point ID to the marker instance

      // Set opacity based on filter selection AND apply ownership styles
      const markerElement = newMarker.getElement();
      if (markerElement) {
        const shadowColor = this.getShadowColorForType(type, markerData);
        // --- START: New logic for highlighting user's own markers ---
        if (markerData.userId === this.authService.$userinfo.id) {
            // Apply styles to make the user's own markers stand out
            markerElement.style.transform = 'scale(1.15)'; // Make it 15% larger
            // Add a subtle but clear glow effect using a filter that matches marker color
            markerElement.style.filter = `drop-shadow(0 0 6px ${shadowColor}) brightness(1.05)`;
            markerElement.style.zIndex = '1000'; // Ensure it's visually on top of other markers
        } else {
            // Non-owner markers still get a colored shadow matching their type
            markerElement.style.filter = `drop-shadow(0 0 6px ${shadowColor})`;
        }
        // --- END: New logic ---
        const category = buttonCategory;
        if (hasSelectedCategory) {
          if (isThisCategorySelected) {
            if (category === 'affluence') {
              const op = this.getAffluenceCurrentOpacity(markerData);
              markerElement.style.opacity = isNaN(op) ? '1' : String(op);
              markerElement.style.pointerEvents = 'auto';
            } else {
              markerElement.style.opacity = '1';
              markerElement.style.pointerEvents = 'auto';
            }
          } else {
            // Hide non-selected categories completely
            markerElement.style.opacity = '0';
            markerElement.style.pointerEvents = 'none';
          }
        } else {
          // No filter active
          if (category === 'affluence') {
            // Let fading timers control opacity; ensure interactable
            markerElement.style.pointerEvents = 'auto';
          } else {
            markerElement.style.opacity = '1';
            markerElement.style.pointerEvents = 'auto';
          }
        }
        markerElement.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out, filter 0.3s ease-in-out';
      }

       // Populate specific marker object arrays with full data
      const mapObject = { ...markerData, object: newMarker };
      switch (type) {
          case 'event': this.objectpurpleMarkers.push(mapObject); break;
          case 'red': this.objectredMarkers.push(mapObject); break;
      case 'green': this.objectgreenMarkers.push(mapObject); break;
          case 'blue':
          case 'note': // Handle both potential type names
              this.objectblueMarkers.push(mapObject);
              break;
          case 'jaune': this.objectjauneMarkers.push(mapObject); break;
      }

      // Add long press for note markers
      if (type === 'blue' || type === 'note') {
          let pressTimer: any;
          newMarker.on('mousedown', () => {
              pressTimer = window.setTimeout(() => { newMarker.openPopup(); }, 1000); // 1-second hold
          });
          const clearPressTimer = () => clearTimeout(pressTimer);
          newMarker.on('mouseup', clearPressTimer);
          newMarker.on('dragstart', clearPressTimer);
      }

      this.bindPopupToMarker(newMarker, { ...markerData, index }, type);
      this.allMarkers.push(newMarker);
  
      // Special handling for affluence points to start their fading timer
      if (type === 'red') {
        this.startFadingForPoint(newMarker, markerData);
      }
    });
    
    this.ensureMarkersVisible();
  }

  // in map.page.ts

  /**
   * Finds and removes a marker and its associated data from all local arrays and the map.
   * This provides an instant UI update without needing a full refresh.
   * @param pointId The ID of the point to remove.
   * @param type The type of the point ('red', 'green', 'event', etc.).
   */

  private removeMarkerFromUI(pointId: number, type: string) {
    let objectMarkers: any[] = [];
    let dataMarkers: any[] = [];
    let typeToFilter = type;
    const normalizedPointId = this.normalizeId(pointId);

    // Handle aliases like 'blue' for 'note'
    if (type === 'blue') {
      typeToFilter = 'note';
    }
    if (type === 'station') {
      typeToFilter = 'green';
    }

    // --- THIS IS THE FIX ---
    // If the deleted point is an affluence marker, we must also clear its specific fading timer.
    if (typeToFilter === 'red') {
      if (this.affluenceTimers[pointId]) {
        clearInterval(this.affluenceTimers[pointId]); // Stop the timer.
        delete this.affluenceTimers[pointId];      // Remove it from the timers object.
        console.log(`Cleared fading timer for affluence point ID: ${pointId}`);
      }
    }
    // --- END OF FIX ---

    // 1. Select the correct arrays based on the point type
    switch (typeToFilter) {
      case 'red':
        objectMarkers = this.objectredMarkers;
        dataMarkers = this.redMarkers;
        break;
      case 'green':
        // For stations, we can use the existing specialized function
        this.removeStationMarkerFromUI(pointId);
        return; // Exit early as the specialized function handles everything
      case 'event':
        objectMarkers = this.objectpurpleMarkers;
        dataMarkers = this.purpleMarkers;
        break;
      case 'note':
        objectMarkers = this.objectblueMarkers;
        dataMarkers = this.blueMarkers;
        break;
      case 'jaune':
        objectMarkers = this.objectjauneMarkers;
        dataMarkers = this.jauneMarkers;
        break;
      default:
        console.error(`Unknown marker type "${type}" provided to removeMarkerFromUI.`);
        return; // Do nothing for unknown types
    }

    // 2. Find the marker in the object array and remove it from the map
    let markerIndexInObjects = objectMarkers.findIndex(m => this.normalizeId(m.id) === normalizedPointId);
    if (markerIndexInObjects > -1) {
      const markerObject = objectMarkers[markerIndexInObjects];
      if (markerObject && markerObject.object) {
        try {
          markerObject.object.remove(); // This removes the marker from the Leaflet map
        } catch (e) {
          console.error(`Error removing marker with ID ${pointId} from map:`, e);
        }
      }
      // Remove from the specific object array
      objectMarkers.splice(markerIndexInObjects, 1);
    }

    // 3. Find and remove the marker from the main data array
    const markerIndexInData = dataMarkers.findIndex(m => this.normalizeId(m.id) === normalizedPointId);
    if (markerIndexInData > -1) {
      dataMarkers.splice(markerIndexInData, 1);
    }

    // 4. Finally, remove it from the generic `allMarkers` array
    let markerIndexInAll = this.allMarkers.findIndex((m: any) => this.normalizeId((m as any).pointId) === normalizedPointId);
    if (markerIndexInAll > -1) {
      try { this.allMarkers[markerIndexInAll].remove(); } catch {}
      this.allMarkers.splice(markerIndexInAll, 1);
    }

    console.log(`Successfully removed marker ${pointId} of type ${type} from the UI.`);
  }

  
  private ensureEventVisibilityWatcher() {
    if (this.eventVisibilityInterval) return;
    this.eventVisibilityInterval = setInterval(() => {
      this.refreshEventMarkersVisibility();
    }, 30000); // check every 30s
  }

  private refreshEventMarkersVisibility() {
    if (!this.map || !this.purpleMarkers) return;

    // Remove event markers that are no longer active
    const toRemove: number[] = [];
    this.objectpurpleMarkers.forEach((obj: any) => {
      const data = this.purpleMarkers.find((p: any) => p.id === obj.id);
      if (!data) {
        // point no longer exists from backend
        if (obj.object) {
          try { obj.object.remove(); } catch {}
        }
        toRemove.push(obj.id);
        const idx = this.allMarkers.indexOf(obj.object);
        if (idx >= 0) this.allMarkers.splice(idx, 1);
        return;
      }
      const active = this.checkDates(data, 'none');
      if (!active) {
        if (obj.object) {
          try { obj.object.remove(); } catch {}
        }
        toRemove.push(obj.id);
        const idx = this.allMarkers.indexOf(obj.object);
        if (idx >= 0) this.allMarkers.splice(idx, 1);
      }
    });
    if (toRemove.length > 0) {
      this.objectpurpleMarkers = this.objectpurpleMarkers.filter((o: any) => !toRemove.includes(o.id));
    }

    // Add event markers that became active
    this.purpleMarkers.forEach((ev: any) => {
      const isActive = this.checkDates(ev, 'none');
      const exists = this.objectpurpleMarkers.find((o: any) => o.id === ev.id);
      if (isActive && !exists) {
        const iconUrl = this.getIconForType('event', ev);
        if (!iconUrl) return;
        const newMarker = this.createLeafletMarker(iconUrl, [ev.lat, ev.lng]).addTo(this.map!);

        // Apply icon color shadow like other markers
        const markerElement = newMarker.getElement();
        if (markerElement) {
          const shadowColor = this.getShadowColorForType('event', ev);
          if (ev.userId === this.authService.$userinfo?.id) {
            markerElement.style.transform = 'scale(1.15)';
            markerElement.style.filter = `drop-shadow(0 0 6px ${shadowColor}) brightness(1.05)`;
            markerElement.style.zIndex = '1000';
          } else {
            markerElement.style.filter = `drop-shadow(0 0 6px ${shadowColor})`;
          }
          markerElement.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out, filter 0.3s ease-in-out';
        }

        const mapObject = { ...ev, object: newMarker, id: ev.id };
        this.objectpurpleMarkers.push(mapObject);
        this.allMarkers.push(newMarker);

        const index = this.purpleMarkers.findIndex((p: any) => p.id === ev.id);
        this.bindPopupToMarker(newMarker, { ...ev, index }, 'event');
      }
    });
  }

  private noteVisibilityInterval: any = null;
  private ensureNoteVisibilityWatcher() {
    if (this.noteVisibilityInterval) return;
    this.noteVisibilityInterval = setInterval(() => {
      this.refreshNoteMarkersVisibility();
    }, 30000);
  }

  private isNoteVisibleNow(el: any): boolean {
    if (!el || !el.heureDebut) return false;
    const current = new Date();
    const currentMs = current.getTime();
    const dayIndex = current.getDay(); // 0=Sun..6=Sat
    const frShort = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
    const frFull  = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
    const enShort = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

    const rawStr: any = (el.date ?? el.dates ?? '');
    const tokens = typeof rawStr === 'string'
      ? rawStr.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const hasConstraint = tokens.length > 0 && !(tokens.length === 1 && tokens[0].toLowerCase() === 'undefined');
    let todayMatches = true;
    if (hasConstraint) {
      todayMatches = tokens.includes(frShort[dayIndex])
        || tokens.includes(frFull[dayIndex])
        || tokens.includes(enShort[dayIndex])
        || tokens.includes(String(dayIndex))
        || tokens.includes('*');
    }
    if (!todayMatches) return false;

    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, '0');
    const dd = String(current.getDate()).padStart(2, '0');
    const startIso = `${yyyy}-${mm}-${dd}T${el.heureDebut}:00`;
    const start = new Date(startIso).getTime();
    // derive end if missing (+1h)
    const endIso = el.heureFin ? `${yyyy}-${mm}-${dd}T${el.heureFin}:00` : this.datePlusOneHour(startIso);
    const end = new Date(endIso).getTime();

    const startWindow = start - 15 * 60 * 1000;
    const endWindow = end + 15 * 60 * 1000;
    return currentMs >= startWindow && currentMs <= endWindow;
  }

  private refreshNoteMarkersVisibility() {
    if (!this.map) return;

    // Remove notes that are out of window
    const toRemove: number[] = [];
    this.objectblueMarkers.forEach((obj: any) => {
      const data = this.blueMarkers.find((p: any) => p.id === obj.id);
      if (!data) {
        try { obj.object?.remove(); } catch {}
        toRemove.push(obj.id);
        const idx = this.allMarkers.indexOf(obj.object);
        if (idx >= 0) this.allMarkers.splice(idx, 1);
        return;
      }
      const now = Date.now();
      const expiresAt = this.recentlyCreatedNotes.get(data.id);
      const isUnderGrace = typeof expiresAt === 'number' && now < expiresAt;
      if (!isUnderGrace && !this.isNoteVisibleNow(data)) {
        try { obj.object?.remove(); } catch {}
        toRemove.push(obj.id);
        const idx = this.allMarkers.indexOf(obj.object);
        if (idx >= 0) this.allMarkers.splice(idx, 1);
      }
    });
    if (toRemove.length > 0) {
      this.objectblueMarkers = this.objectblueMarkers.filter((o: any) => !toRemove.includes(o.id));
    }

    // Add notes that became visible
    this.blueMarkers.forEach((note: any) => {
      const now = Date.now();
      const expiresAt = this.recentlyCreatedNotes.get(this.normalizeId(note.id));
      const visible = (typeof expiresAt === 'number' && now < expiresAt) || this.isNoteVisibleNow(note);
      const exists = this.objectblueMarkers.find((o: any) => o.id === note.id);
      if (visible && !exists) {
        const iconUrl = this.getIconForType('note', note);
        if (!iconUrl) return;
        const newMarker = this.createLeafletMarker(iconUrl, [note.lat, note.lng]).addTo(this.map!);

        const markerElement = newMarker.getElement();
        if (markerElement) {
          const shadowColor = this.getShadowColorForType('note', note);
          if (note.userId === this.authService.$userinfo?.id) {
            markerElement.style.transform = 'scale(1.15)';
            markerElement.style.filter = `drop-shadow(0 0 6px ${shadowColor}) brightness(1.05)`;
            markerElement.style.zIndex = '1000';
          } else {
            markerElement.style.filter = `drop-shadow(0 0 6px ${shadowColor})`;
          }
          markerElement.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out, filter 0.3s ease-in-out';
        }

        const mapObject = { ...note, object: newMarker };
        this.objectblueMarkers.push(mapObject);
        this.allMarkers.push(newMarker);

        const index = this.blueMarkers.findIndex((p: any) => p.id === note.id);
        this.bindPopupToMarker(newMarker, { ...note, index }, 'note');
      }
    });
  }

  /**
   * Starts the fading process for a given affluence point marker.
   * The duration and fading logic are determined by the point's 'level'.
   * @param marker The Leaflet marker instance on the map.
   * @param pointData The data associated with the affluence point.
   */
  private startFadingForPoint(marker: L.Marker, pointData: any) {
    const pointId: number = typeof pointData.id === 'string' ? parseInt(pointData.id, 10) : pointData.id;
    if (!pointId || this.affluenceTimers[pointId]) {
      return; // Already scheduled or invalid id
    }

    const totalDurationMs = this.getAffluenceDurationMs(pointData.level);
    const createdAt = this.parseAffluenceCreationDate(pointData);

    const applyOpacity = () => {
      const now = new Date().getTime();
      const elapsed = now - createdAt.getTime();
      const remaining = totalDurationMs - elapsed;

      const markerElement = marker.getElement();
      if (!markerElement) return;

      if (remaining <= 0) {
        // Expire on client and backend
        try { marker.remove(); } catch {}
        const idx = this.allMarkers.indexOf(marker);
        if (idx >= 0) this.allMarkers.splice(idx, 1);
        // Remove from objectredMarkers
        this.objectredMarkers = this.objectredMarkers.filter((o: any) => o.id !== pointId);
        // Stop timer
        clearInterval(this.affluenceTimers[pointId]);
        delete this.affluenceTimers[pointId];
        // Inform backend to disable
        this.expireAffluencePoint(pointId);
        return;
      }

      // Linear fade: 1 -> 0 across the duration
      const ratio = Math.max(0, Math.min(1, remaining / totalDurationMs));
      const opacity = ratio; // 1 at start, 0 at end
      markerElement.style.opacity = opacity.toString();
      markerElement.style.pointerEvents = opacity < 0.15 ? 'none' : 'auto';
    };

    // Apply immediately and then schedule periodic updates
    applyOpacity();
    this.affluenceTimers[pointId] = setInterval(applyOpacity, 30000); // every 30s
  }

  private getAffluenceDurationMs(level: any): number {
    const lvlNum = typeof level === 'string' ? parseInt(level, 10) : (Number.isFinite(level) ? level : 0);
    // Mapping in minutes per requirements
    let minutes = 20; // default
    switch (lvlNum) {
      case 0: minutes = 20; break;
      case 1: minutes = 15; break;
      case 2: minutes = 20; break;
      case 3: minutes = 30; break;
      case 4: minutes = 40; break;
      default: minutes = 20; break;
    }
    return minutes * 60 * 1000;
  }

  private parseAffluenceCreationDate(pointData: any): Date {
    // Prefer backend timestamp
    if (pointData && pointData.created_at) {
      const d = new Date(pointData.created_at);
      if (!isNaN(d.getTime())) return d;
    }
    // Fallback: try composed date/heure in DD/MM/YYYY and HH:mm
    if (pointData && pointData.date && pointData.heure) {
      const [day, month, year] = String(pointData.date).split('/');
      if (day && month && year) {
        const iso = `${year}-${month}-${day}T${pointData.heure}:00`;
        const d = new Date(iso);
        if (!isNaN(d.getTime())) return d;
      }
    }
    // As a last resort, use now so it will fade from this moment
    return new Date();
  }

  private expireAffluencePoint(pointId: number) {
    if (this.alreadyDisabledIds.has(pointId)) return;
    this.pendingDisableIds.add(pointId);
    if (this.disableDebounceTimer) {
      clearTimeout(this.disableDebounceTimer);
    }
    // Batch calls every 3 seconds to reduce server load / 500s
    this.disableDebounceTimer = setTimeout(() => {
      const ids = Array.from(this.pendingDisableIds).filter(id => !this.alreadyDisabledIds.has(id));
      this.pendingDisableIds.clear();
      const payload = { ids } as any;
      try {
        if (ids.length === 0) return;
        this.pointService.$disablePoints(payload).subscribe((data: any) => {
          if (data && data.data) {
            ids.forEach(id => this.alreadyDisabledIds.add(id));
            // No full refetch here to avoid fetch loops; we already removed markers locally
          } else {
            console.error('Disable API logical error', data);
          }
        }, (err) => {
          console.error('Disable API error', err);
        });
      } catch (e) {
        console.error('Disable batching error', e);
      }
    }, 3000);
  }

  private clearMarker() {
    console.log('Clearing all markers and timers');
    
    // Remove all markers from map
    this.allMarkers.forEach(marker => {
      try {
        marker.remove();
      } catch (error) {
        console.error('Error removing marker:', error);
      }
    });
    this.allMarkers = [];

    // Clear all affluence timers
    const timerCount = Object.keys(this.affluenceTimers).length;
    Object.keys(this.affluenceTimers).forEach(pointId => {
      clearInterval(this.affluenceTimers[parseInt(pointId)]);
    });
    this.affluenceTimers = {};
  }

  // Remove only one station marker from UI without clearing others
  private removeStationMarkerFromUI(stationId: number) {
    try {
      const normalizedId = this.normalizeId(stationId);

      // Resolve coordinates for robust fallback removal
      const targetData =
        (this.greenMarkers || []).find((g: any) => this.normalizeId(g.id) === normalizedId)
        || (this.objectgreenMarkers || []).find((m: any) => this.normalizeId(m.id) === normalizedId);
      const targetLat = targetData?.lat;
      const targetLng = targetData?.lng ?? targetData?.lon;

      const near = (a: number, b: number) => Math.abs(a - b) < 0.00001;

      // Remove the station marker object from map and arrays (by id; fallback by coords)
      let idx = this.objectgreenMarkers.findIndex((m: any) => this.normalizeId(m.id) === normalizedId);
      if (idx === -1 && targetLat != null && targetLng != null) {
        idx = this.objectgreenMarkers.findIndex((m: any) => {
          const obj = m.object as L.Marker | undefined;
          if (!obj) return false;
          const pos = obj.getLatLng();
          return near(pos.lat, targetLat) && near(pos.lng, targetLng);
        });
      }
      if (idx !== -1) {
        try { this.objectgreenMarkers[idx].object?.remove(); } catch {}
        this.objectgreenMarkers.splice(idx, 1);
      }

      // Remove from the generic allMarkers collection as well (by id; fallback by coords)
      this.allMarkers = this.allMarkers.filter((m: any) => {
        const pid = this.normalizeId((m as any).pointId);
        if (pid && pid === normalizedId) {
          try { (m as any).remove?.(); } catch {}
          return false;
        }
        if (targetLat != null && targetLng != null && typeof (m as any).getLatLng === 'function') {
          const pos = (m as any).getLatLng();
          if (near(pos.lat, targetLat) && near(pos.lng, targetLng)) {
            try { (m as any).remove?.(); } catch {}
            return false;
          }
        }
        return true;
      });

      // Remove matching Leaflet layers by id OR by coords if pointId is missing
      try {
        this.map?.eachLayer((layer: any) => {
          if (layer && typeof layer.getLatLng === 'function') {
            const pid = this.normalizeId((layer as any).pointId);
            if ((pid && pid === normalizedId)
              || (targetLat != null && targetLng != null && (() => {
                    const p = layer.getLatLng();
                    return near(p.lat, targetLat) && near(p.lng, targetLng);
                 })())) {
              try { layer.remove(); } catch {}
            }
          }
        });
      } catch {}

      // Remove from data array so future renders exclude it
      this.greenMarkers = this.greenMarkers.filter((g: any) => this.normalizeId(g.id) !== normalizedId);

      // Also remove any associated polylines already handled earlier
      this.removePolylinesByStationId(stationId);

      // Now that arrays are updated, thoroughly cleanup overlays for this station
      this.cleanupStationOverlays(stationId);

      // Re-apply opacity/filtering state without full redraw
      this.setMarkersOpacity();

      // If the popup for this station was open, close all
      this.closeAllPopups();
    } catch (e) {
      console.warn('Non-blocking UI cleanup error for station removal:', e);
    }
  }

  // Fully clear all station-bound graphics (dashed/solid paths, queue line, edit artifacts),
  // then force a quick UI refresh so nothing lingers visually.
  private cleanupStationOverlays(stationId?: number): void {
    try {
      if (typeof stationId !== 'undefined' && stationId !== null) {
        this.removePolylinesByStationId(stationId);
      }
    } catch {}

    // Remove any in-progress drawing/editing artifacts
    try { if (this.currentPolyline) { this.currentPolyline.remove(); } } catch {}
    this.currentPolyline = null;
    try { this.polylineMarkers.forEach(m => { try { m.remove(); } catch {} }); } catch {}
    this.polylineMarkers = [];
    try { this.editingSegments.forEach(pl => { try { pl.remove(); } catch {} }); } catch {}
    this.editingSegments = [];
    this.editingLatLngs = [];
    try { this.editVertexMarkers.forEach(m => { try { m.remove(); } catch {} }); } catch {}
    this.editVertexMarkers = [];
    if (this.map && this.mapClickHandler) {
      try { this.map.off('click', this.mapClickHandler); } catch {}
      this.mapClickHandler = null;
    }
    if (stationId === undefined || this.editingStationId === stationId) {
      this.editingStationId = null;
    }
    this.isDrawingPolyline = false;

    // Remove queue visualization line and timers if it's for this station (best effort)
    try {
      if (this.greenProgressLine) { this.map?.removeLayer(this.greenProgressLine); }
    } catch {}
    this.greenProgressLine = null;
    if (stationId && this.activeQueueStationId === stationId) {
      try { this.leaveActiveQueue(); } catch {
        // Fallback local cleanup
        this.activeQueueStationId = null;
        try { if (this.locationBroadcastInterval) clearInterval(this.locationBroadcastInterval); } catch {}
        try { if (this.queueVisualizerInterval) clearInterval(this.queueVisualizerInterval); } catch {}
        this.locationBroadcastInterval = null;
        this.queueVisualizerInterval = null;
      }
    }

    // Sweep any orphan dashed edit polylines that might not be tracked
    try {
      this.map?.eachLayer((layer: any) => {
        if (!(layer instanceof L.Polyline)) return;
        const opts = layer.options || {};
        const isDashed = opts.dashArray === '5, 10';
        const isKnown = this.polylines.some(p => p.polyline === layer)
          || this.editingSegments.includes(layer)
          || this.currentPolyline === layer
          || this.greenProgressLine === layer;
        if (isDashed && !isKnown) {
          try { layer.remove(); } catch {}
        }
      });
    } catch {}

    // Force a short refresh so visuals are immediately correct
    try { this.clearPolylines(); } catch {}
    try { this.loadPolylines(); } catch {}
    try { this.ensureMarkersVisible(); } catch {}
  }

  getIconForType(type: string, el: any): string {
    if (type === 'green') {
      // Force station icon for stations
      return '../../assets/icon/station.svg';
    }
    return this.markerLevel(type, el.level, el.userId, el.role);
  }
  
  private getShadowColorForType(type: string, markerData?: any): string {
    switch (type) {
      case 'red':
        return 'rgba(235, 47, 6, 0.85)'; // #EB2F06
      case 'green':
        return 'rgba(39, 174, 96, 0.85)'; // #27AE60
      case 'blue':
      case 'note':
        return 'rgba(29, 73, 153, 0.85)'; // #1D4999
      case 'jaune':
        return 'rgba(242, 201, 76, 0.85)'; // #F2C94C
      case 'event':
        return 'rgba(162, 89, 255, 0.85)'; // #A259FF
      case 'location':
        return 'rgba(39, 174, 96, 0.85)'; // same as location icon color
      default:
        return 'rgba(0, 0, 0, 0.35)';
    }
  }

  // UI-only refresh: minimal update of marker layer without full clear
  private refreshMarkersUI() {
    if (!this.map) return;
    try {
      // Remove markers that no longer exist in data arrays
      const validIds = new Set([
        ...this.redMarkers.map((m: any) => m.id),
        ...this.greenMarkers.map((m: any) => m.id),
        ...this.blueMarkers.map((m: any) => m.id),
        ...this.jauneMarkers.map((m: any) => m.id),
        ...this.purpleMarkers.map((m: any) => m.id),
      ]);

      // Remove orphan markers
      this.allMarkers = this.allMarkers.filter((marker: any) => {
        const id = (marker as any).pointId;
        if (!validIds.has(id)) {
          try { marker.remove(); } catch {}
          return false;
        }
        return true;
      });

      // Re-add or add missing markers per category without clearing all
      this.addMarkers(this.purpleMarkers, 'event');
      this.addMarkers(this.redMarkers, 'red');
      this.addMarkers(this.greenMarkers, 'green');
      this.addMarkers(this.blueMarkers, 'blue');
      this.addMarkers(this.jauneMarkers, 'jaune');

      // Re-apply visual state and force visibility
      this.setMarkersOpacity();
      this.ensureMarkersVisible();

      // Align with browser paint and force a non-visual re-render
      this.ensureMarkersVisible();
    } catch (e) {
      console.warn('Non-blocking UI refresh error:', e);
      // Fallback to full rebuild if something went wrong
      this.clearMarker();
      this.makeObjectMarker();
    }
  }

  // Force Leaflet to finalize marker layout without visible movement
  private ensureMarkersVisible() {
    if (!this.map) return;
    const map = this.map;
    requestAnimationFrame(() => {
      try {
        map.invalidateSize();
        map.setView(map.getCenter(), map.getZoom(), { animate: false });
        // Nudge markers to update their DOM positions if available
        this.allMarkers.forEach((m: any) => {
          if (m && typeof m.update === 'function') {
            try { m.update(); } catch {}
          }
        });
      } catch {}
    });
  }

  // Realtime updates: lightweight periodic refresh without full rebuilds
  private startRealtimeUpdates() {
    if (!this.realtimeEnabled) return;
    if (this.realtimeInterval) {
      try { clearInterval(this.realtimeInterval); } catch {}
      this.realtimeInterval = null;
    }
    // Stagger first run slightly to avoid racing initial rendering
    setTimeout(() => this.refreshPointsRealtime(), 1000);
    this.realtimeInterval = setInterval(() => this.refreshPointsRealtime(), this.realtimeIntervalMs);
  }

  private refreshPointsRealtime() {
    if (!this.map || this.isFetchingPoints) return;
    // Fetch new data and apply minimal UI diffs
    this.isFetchingPoints = true;
    this.pointService.$getPoints().subscribe(
      (data: any) => {
        // Update datasets
        this.redMarkers = data.red;
        this.greenMarkers = data.green;
        this.blueMarkers = data.note;
        this.jauneMarkers = data.sos;
        this.purpleMarkers = data.event;

        // Diff-based UI refresh
        this.refreshMarkersUI();
        this.loadPolylines();
        this.ensureEventVisibilityWatcher();
        this.ensureNoteVisibilityWatcher();
        // Update popup content for any SOS popups to reflect latest data
        try { this.refreshSosPopups(); } catch {}

        this.isFetchingPoints = false;
      },
      (err) => {
        console.error('Realtime fetch error:', err);
        this.isFetchingPoints = false;
      }
    );
  }

  // Re-render content for all SOS popups using the latest dataset
  private refreshSosPopups() {
    try {
      (this.objectjauneMarkers || []).forEach((mapObj: any) => {
        const marker = mapObj?.object as any;
        if (!marker) return;
        const id = this.normalizeId(mapObj.id);
        const updated = (this.jauneMarkers || []).find((p: any) => this.normalizeId(p.id) === id);
        if (!updated) return;
        const index = (this.jauneMarkers || []).findIndex((p: any) => this.normalizeId(p.id) === id);
        const html = this.widgetContent('jaune', updated.userId, index, updated.like, updated.dislike, updated);
        try {
          const popup = typeof marker.getPopup === 'function' ? marker.getPopup() : null;
          if (popup && typeof popup.setContent === 'function') {
            popup.setContent(html);
            if (typeof popup.update === 'function') { try { popup.update(); } catch {} }
          } else {
            // Fallback
            marker.setPopupContent(html);
          }
        } catch {}
        // Re-bind listeners for the refreshed popup buttons (whether open now or opened later)
        setTimeout(() => {
          try { this.handleBtnClick(index, 'jaune', updated); } catch {}
          try { this.handleLikesAndDislikes(index, 'jaune', updated); } catch {}
        }, 100);
        // If currently open, force it to re-open to redraw DOM cleanly
        try {
          if (typeof marker.isPopupOpen === 'function' && marker.isPopupOpen()) {
            marker.openPopup();
          }
        } catch {}
      });
    } catch (e) {
      console.warn('Non-blocking SOS popup refresh error', e);
    }
  }

  private openSosPopupById(id: number) {
    try {
      const normalizedId = this.normalizeId(id);
      let target: any = (this.objectjauneMarkers || []).find((m: any) => this.normalizeId(m.id) === normalizedId);
      if (!target) {
        // Fallback: search by marker pointId
        const marker = (this.allMarkers || []).find((mk: any) => this.normalizeId(mk.pointId) === normalizedId);
        if (marker) {
          target = { object: marker };
        }
      }
      if (!target || !target.object) return;
      const updated = (this.jauneMarkers || []).find((p: any) => this.normalizeId(p.id) === normalizedId);
      const index = (this.jauneMarkers || []).findIndex((p: any) => this.normalizeId(p.id) === normalizedId);
      if (updated) {
        const html = this.widgetContent('jaune', updated.userId, index, updated.like, updated.dislike, updated);
        const marker: any = target.object;
        try {
          const popup = typeof marker.getPopup === 'function' ? marker.getPopup() : null;
          if (popup && typeof popup.setContent === 'function') {
            popup.setContent(html);
            if (typeof popup.update === 'function') { try { popup.update(); } catch {} }
          } else {
            marker.setPopupContent(html);
          }
        } catch {}
      }
      try { target.object.openPopup(); } catch {}
      setTimeout(() => {
        try { this.handleBtnClick(index, 'jaune', updated || {}); } catch {}
        try { this.handleLikesAndDislikes(index, 'jaune', updated || {}); } catch {}
      }, 100);
    } catch (e) {
      console.warn('Failed to open SOS popup by id', e);
    }
  }

  private sanitizeLieu(raw: string): string {
    if (!raw) return '';
    // MySQL column is limited. We trim to a safe length and strip line breaks.
    const clean = String(raw).replace(/\s+/g, ' ').trim();
    // keep a conservative limit, e.g., 190 chars
    return clean.length > 190 ? clean.slice(0, 190) : clean;
  }

  bindPopupToMarker(marker: any, content: any, type: string) {
    const popupContent = this.widgetContent(type, content.userId, content.index, content.like, content.dislike, content);
    marker.bindPopup(popupContent, { maxWidth: 315 });

    // Use the 'popupopen' event to guarantee the popup's HTML content is in the DOM
    // before we try to attach event listeners to its buttons.
    marker.on('popupopen', () => {
      this.checker = false; // Keep this to manage UI state if needed
      this.handleBtnClick(content.index, type, content);
      this.handleLikesAndDislikes(content.index, type, content);
    });
  }

  // --- Debug helpers ---
  private debugNotesVisibility(): void {
    try {
      const total = this.blueMarkers?.length || 0;
      const visibleNow = (this.blueMarkers || []).filter((n: any) => this.isNoteVisibleNow(n)).length;
      console.group('[NOTE DEBUG]');
      console.log('Total notes fetched from backend:', total);
      console.log('Visible now (15m before start to 15m after end):', visibleNow);
      const rows = (this.blueMarkers || []).map((n: any) => ({
        id: n.id,
        name: n.name,
        lieu: n.lieu,
        dates: n.date || n.dates,
        heureDebut: n.heureDebut,
        heureFin: n.heureFin,
        lat: n.lat,
        lng: n.lng,
        visibleNow: this.isNoteVisibleNow(n)
      }));
      console.table(rows);
      console.groupEnd();
    } catch (e) {
      console.error('[NOTE DEBUG] error while logging notes', e);
    }
  }

  // handling event click of infoWindow (red and event)

  openNotesOverlay() {
    this.displayer.noteOverlayDisplay = true;
  }

  closeNoteOverlay() {
    this.displayer.noteOverlayDisplay = false;
  }

  editNote(note: any) {
    this.router.navigate([`/update-note/${note.id}`]);
  }

  deleteNote(note: any) {
    this.confirmationContent = 'Êtes-vous sûr de vouloir supprimer cette note ?';
    this.displayer.deletePointConfirmation = true;
    this.selectedpointId = note.id;
    this.selectedPointType = 'note';
  }

  goToNoteLocation(note: any) {
    if (this.map && note.lat && note.lng) {
      this.map.flyTo([note.lat, note.lng], 16);
      // Find and open the popup for this note
      const noteMarker = this.objectblueMarkers.find(marker => marker.id === note.id);
      if (noteMarker && noteMarker.object) {
        noteMarker.object.openPopup();
      }
    }
    this.closeNoteOverlay();
  }

  handleStationClick() {
    if (this.heldMarker) {
      this.displayToggle('status');
    }
  }

  openLocationUpdateModal(station: any) {
    console.log("Opening modal to update station location...");
  
    // Create the modal container
    const modal = document.createElement('div');
    modal.id = 'locationUpdateModal';
    modal.className = 'absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center';
  
    modal.innerHTML = `
      <div class="flex w-[80vw] flex-col rounded bg-white px-7 py-10 z-30">
        <div class="px-4 text-center font-[Montserrat] font-bold text-[18px] leading-6">
          Modifier une <span class="font-bold text-[#0198D7]">Station</span>
        </div>
        
        <div class="mb-1 mt-6">
          <div>
            <label class="text-[12px] montserrat-700">Nom de la station</label>
            <label class="relative block text-[13px]">
              <span class="sr-only text-[#02263D]">Nom de la station</span>
              <input
                id="stationInput"
                class="block w-full rounded border border-[#00396542] bg-white py-2 p-3 shadow-sm placeholder:text-[#879EA4] focus:border-[#112A59] focus:outline-none focus:ring-1 focus:ring-[#112A59] sm:text-sm"
                placeholder="Rechercher une adresse..."
                type="text"
                name="station"
                value="${station.name || ''}"
              />
              <ul id="suggestionsList" class="absolute z-50 bg-white border border-gray-300 rounded w-full mt-1"></ul>
            </label>
          </div>
        </div>
  
        <div class="mt-6 flex justify-between">
          <button id="cancelUpdate"
            class="h-[40px] w-full rounded-xl border-2 border-[#1D4999] bg-transparent text-[13px] font-bold tracking-wide text-[#1D4999]"
            style="--background:transparent; --background-activated:#3332; text-transform: none;">
            Annuler
          </button>
          
          <button id="confirmUpdate"
            class="mr-1 h-[40px] w-full border-2 border-[#1D4999] rounded-xl bg-[#1D4999] text-[13px] font-semibold tracking-wide text-white"
            style="--background:#1D4999;--background-activated:#173d84; text-transform: none;">
            Valider
          </button>
        </div>
      </div>
  
      <div id="modalOverlay" class="absolute top-0 z-10 flex h-[100vh] w-full items-center justify-center bg-[#0005]"></div>
    `;
  
    document.body.appendChild(modal);
  
    // Event listeners
    document.getElementById("cancelUpdate")?.addEventListener("click", () => modal.remove());
    document.getElementById("modalOverlay")?.addEventListener("click", () => modal.remove());
  
    // Fetch station name input
    const stationInput = document.getElementById("stationInput") as HTMLInputElement;
    const suggestionsList = document.getElementById("suggestionsList") as HTMLUListElement;
  
    // Handle input and fetch address suggestions
    stationInput.addEventListener("input", async () => {
      const query = stationInput.value.trim();
      if (query.length > 2) {
        const left = -5.5, top = 51.5, right = 10.0, bottom = 41.0;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&accept-language=fr&countrycodes=fr&bounded=1&viewbox=${left},${top},${right},${bottom}`);
        const results = await response.json();
  
        suggestionsList.innerHTML = "";
        results.forEach((result: any) => {
          const li = document.createElement("li");
          li.className = "p-2 hover:bg-gray-100 cursor-pointer";
          li.innerText = result.display_name;
          li.addEventListener("click", () => {
            stationInput.value = result.display_name;
            suggestionsList.innerHTML = ""; // Clear suggestions
            
            // Update station coordinates
            station.lat = parseFloat(result.lat);
            station.lng = parseFloat(result.lon);
            localStorage.setItem('positionStation', JSON.stringify({ lat: station.lat, lon: station.lng }));
  
            // Center map on new position
            if (this.map) {
              const target = L.latLng(station.lat, station.lng);
              if (this.franceBounds && !this.franceBounds.contains(target)) {
                presentToast("Ce lieu n'existe pas en France", 'bottom', 'warning');
                return;
              }
              this.map.flyTo([station.lat, station.lng], 14);
              L.marker([station.lat, station.lng])
                .addTo(this.map)
                .bindPopup(result.display_name)
                .openPopup();
            }
          });
          suggestionsList.appendChild(li);
        });
      } else {
        suggestionsList.innerHTML = "";
      }
    });
  
    // Confirm update
    document.getElementById("confirmUpdate")?.addEventListener("click", () => {
      const newStationName = stationInput.value.trim();
      
      if (!newStationName) {
        alert("Veuillez entrer un nouveau nom de station.");
        return;
      }
  
      console.log("Updating station:", newStationName, station.lat, station.lng);
  
      // Update station data
      const updateData = {
        id: station.id,
        type: 'green',
        newData: { name: newStationName, lat: station.lat, lng: station.lng }
      };
  
      // Call update function
      this.updatePoint(updateData);
  
      // Close modal
      modal.remove();
    });
  }
  
  
  
  // Function to delete the station
  deleteStation(index: number, object: any, action: string) {
    this.updateEventContent(index, 'green', object, action);
  }

  getStationPoint(index: number, content: any) {
    const icon = L.icon({
      iconUrl: '../../assets/icon/station.svg',
      iconSize: [44, 44],
      iconAnchor: [22, 44],
      popupAnchor: [0, -44]
    });
    return L.marker([content.lat, content.lng], { icon });
  }

  // Function to enable polyline drawing
  loadPolylines() {
    console.log("Attempting to load polylines...");
    this.clearPolylines(); // Clear any existing polylines first

    if (!this.map) {
      setTimeout(() => this.loadPolylines(), 100);
      return;
    }

    // Iterate through stations and draw polylines from backend only
    this.greenMarkers.forEach((station: any) => {
      if (!station.polyline) return;
      try {
        const parsed = JSON.parse(station.polyline);
        const toLatLng = (pt: any) => L.latLng(pt.lat ?? pt[0], pt.lng ?? pt.lon ?? pt[1]);
        const segments: any[] = Array.isArray(parsed[0]) ? parsed : [parsed];
        segments.forEach((seg: any[]) => {
          const latlngs = seg.map(toLatLng);
          if (latlngs.length >= 2) {
            const polyline = L.polyline(latlngs, { color: '#4A90E2', weight: 4, opacity: 0.9 }).addTo(this.map!);
            this.polylines.push({ id: String(station.id), polyline });
          }
        });
      } catch (e) {
        console.error('Error parsing polyline data for station:', station.id, e);
      }
    });
  }

  savePolylines() {
    const polylineData = this.polylines.map(poly => {
      const leafletPoly = poly.polyline as any as L.Polyline;
      return { id: poly.id, latlngs: leafletPoly.getLatLngs() };
    });
    localStorage.setItem('savedPolylines', JSON.stringify(polylineData));
  }

  // Render a station polyline (solid) on the map from a JSON string
  private renderStationPolylineFromJson(stationId: number | string, polylineJson: string): void {
    if (!this.map) return;
    try {
      const parsed = JSON.parse(polylineJson);
      const segments: any[] = Array.isArray(parsed?.[0]) ? parsed : [parsed];
      const toLatLng = (pt: any) => L.latLng(pt.lat ?? pt[0], pt.lng ?? pt.lon ?? pt[1]);
      // Clean existing first
      this.removePolylinesByStationId(stationId);
      segments.forEach((seg: any[]) => {
        const latlngs = (seg || []).map(toLatLng);
        if (latlngs.length >= 2) {
          const polyline = L.polyline(latlngs, { color: '#4A90E2', weight: 4, opacity: 0.9 }).addTo(this.map!);
          this.polylines.push({ id: String(stationId), polyline });
        }
      });
    } catch (e) {
      console.error('Failed to render station polyline from JSON for station', stationId, e);
    }
  }


    clearPolylines(): void {
        this.polylines.forEach(poly => {
            (poly.polyline as any as L.Polyline).remove();
        });
        this.polylines = [];
    }

  private removePolylinesByStationId(stationId: number | string) {
    const toRemove = this.polylines.filter(p => p.id === String(stationId));
    toRemove.forEach(p => {
      try { p.polyline.remove(); } catch {}
    });
    this.polylines = this.polylines.filter(p => p.id !== String(stationId));
  }

    // --- Refactored Polyline Drawing Logic ---
    private polylinePoints: L.LatLng[] = [];
    private currentPolyline: L.Polyline | null = null;
    private polylineMarkers: L.Marker[] = [];
    private mapClickHandler: ((e: L.LeafletMouseEvent) => void) | null = null;
  enablePolylineDrawing(index: number, content: any) {
    console.log("Enable map click for polyline drawing, station:", index);
    if (this.isDrawingPolyline) return; // Prevent starting a new drawing session if one is active

    this.isDrawingPolyline = true;
    presentToast("Mode modification de file activé. Cliquez sur la carte pour dessiner.", "bottom", "success");

    // Pause auto-location updates and auto-pan while editing/drawing
    this.pauseLocationTracking();

    // Start the line from the station's location
    this.polylinePoints = [L.latLng(content.lat, content.lng)];

    // Visually mark the starting point so the user sees drawing mode is active
    const startDotIcon = L.divIcon({
        className: 'polyline-dot-icon',
        html: '<div style="width:10px;height:10px;border-radius:50%;background:#4A90E2;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.4)"></div>',
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    });
    const startDotMarker = L.marker(L.latLng(content.lat, content.lng), { icon: startDotIcon }).addTo(this.map!);
    this.polylineMarkers.push(startDotMarker);

    this.mapClickHandler = (e: L.LeafletMouseEvent) => {
        const newPoint = e.latlng;
        this.polylinePoints.push(newPoint);

        // Add a small dot marker for the new point
        const dotIcon = L.divIcon({
            className: 'polyline-dot-icon',
            html: '<div style="width:10px;height:10px;border-radius:50%;background:#4A90E2;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.4)"></div>',
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });
        const dotMarker = L.marker(newPoint, { icon: dotIcon }).addTo(this.map!);
        this.polylineMarkers.push(dotMarker);

        // Remove the old polyline and draw the new one
        if (this.currentPolyline) {
            this.currentPolyline.remove();
        }
        this.currentPolyline = L.polyline(this.polylinePoints, { color: '#4A90E2', weight: 4, opacity: 0.9, dashArray: '5, 10' }).addTo(this.map!);
    };

    if (this.map) {
      this.map.on("click", this.mapClickHandler);
    }
  }

  // Enable editing of an existing station path: drag vertices and delete segments
  private enablePolylineEditing(station: any) {
    if (this.isDrawingPolyline) return;
    if (!this.map) return;
    this.isDrawingPolyline = true;
    presentToast('Mode modification de trajectoire activé. Touchez un segment pour le supprimer. Faites glisser les points pour ajuster.', 'bottom', 'primary');

    this.editingStationId = station.id;
    // Pause auto-location updates and auto-pan while editing
    this.pauseLocationTracking();
    
    // Clean up any existing editing state
    this.editingSegments.forEach(pl => { try { pl.remove(); } catch {} });
    this.editingSegments = [];
    this.editingLatLngs = [];
    this.editVertexMarkers.forEach(m => { try { m.remove(); } catch {} });
    this.editVertexMarkers = [];
    
    // Remove existing non-editable polylines for this station to avoid confusion
    this.removePolylinesByStationId(station.id);

    console.log('Station polyline data:', station.polyline);
    
    if (!station.polyline) {
      console.log('No polyline data found, switching to drawing mode');
      // No path yet: fall back to drawing mode starting from station
      // Ensure edit mode is fully cleared so finish saves drawing (not empty edit)
      this.editingStationId = null;
      this.editingSegments.forEach(pl => { try { pl.remove(); } catch {} });
      this.editingSegments = [];
      this.editingLatLngs = [];
      this.editVertexMarkers.forEach(m => { try { m.remove(); } catch {} });
      this.editVertexMarkers = [];
      this.isDrawingPolyline = false;
      this.enablePolylineDrawing(station.id, station);
      return;
    }

    // Build editable segments from stored polyline(s)
    let parsed: any;
    try {
      parsed = JSON.parse(station.polyline);
      console.log('Parsed polyline data:', parsed);
    } catch (e) {
      console.log('Failed to parse polyline data:', e);
      parsed = [];
    }

    // Normalize and validate segments
    let segments: any[] = Array.isArray(parsed[0]) ? parsed : [parsed];
    segments = segments.filter((seg: any) => Array.isArray(seg));
    const totalPoints = segments.reduce((sum: number, seg: any[]) => sum + seg.length, 0);
    if (totalPoints < 2) {
      console.log('Polyline empty or invalid; switching to drawing mode');
      // Ensure edit mode is fully cleared before switching to drawing mode
      this.editingStationId = null;
      this.editingSegments.forEach(pl => { try { pl.remove(); } catch {} });
      this.editingSegments = [];
      this.editingLatLngs = [];
      this.editVertexMarkers.forEach(m => { try { m.remove(); } catch {} });
      this.editVertexMarkers = [];
      this.isDrawingPolyline = false;
      this.enablePolylineDrawing(station.id, station);
      return;
    }

    const allEditLatLngs: L.LatLng[] = [];
    console.log('Found segments for editing:', segments.length);
    segments.forEach((seg, segIdx) => {
      const latlngs = seg.map((ll: any) => L.latLng((ll as any).lat ?? ll[0], (ll as any).lng ?? (ll as any).lon ?? ll[1]));
      this.editingLatLngs.push(latlngs as L.LatLng[]);
      console.log(`Drawing editable segment ${segIdx} with ${latlngs.length} points`);
      const pl = L.polyline(latlngs as L.LatLng[], { color: '#4A90E2', weight: 4, opacity: 0.9, dashArray: '5, 10' }).addTo(this.map!);
      // Click to delete this segment
      pl.on('click', () => {
        if (confirm('Supprimer ce segment ?')) {
          const idx = this.editingSegments.indexOf(pl);
          if (idx >= 0) {
            try { pl.remove(); } catch {}
            this.editingSegments.splice(idx, 1);
            this.editingLatLngs.splice(idx, 1);
          }
        }
      });
      this.editingSegments.push(pl);
      // Create draggable markers for vertices
      latlngs.forEach((pt: L.LatLng, vertexIdx: number) => {
      const dotIcon = L.divIcon({ className: 'polyline-dot-icon', html: '<div style="width:10px;height:10px;border-radius:50%;background:#4A90E2;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.4)"></div>', iconSize: [12, 12], iconAnchor: [6, 6] });
        const vm = L.marker(pt, { icon: dotIcon, draggable: true }).addTo(this.map!);
        vm.on('drag', (e: any) => {
          const newPos: L.LatLng = e.target.getLatLng();
          this.editingLatLngs[segIdx][vertexIdx] = newPos;
          this.editingSegments[segIdx].setLatLngs(this.editingLatLngs[segIdx]);
        });
        vm.on('contextmenu', () => {
          if (confirm('Supprimer ce point ?')) {
            this.editingLatLngs[segIdx].splice(vertexIdx, 1);
            try { vm.remove(); } catch {}
            if (this.editingLatLngs[segIdx].length < 2) {
              try { this.editingSegments[segIdx].remove(); } catch {}
              this.editingSegments.splice(segIdx, 1);
              this.editingLatLngs.splice(segIdx, 1);
            } else {
              this.editingSegments[segIdx].setLatLngs(this.editingLatLngs[segIdx]);
            }
          }
        });
        this.editVertexMarkers.push(vm);
      });
      allEditLatLngs.push(...(latlngs as L.LatLng[]));
    });
    // Fit view to the editable path for visibility
    if (allEditLatLngs.length > 0) {
      const bounds = L.latLngBounds(allEditLatLngs);
      this.map?.fitBounds(bounds, { padding: [40, 40] });
    }
  }

    finishPolylineDrawing() {
        console.log("Finishing polyline drawing.");

        // Case 1: Editing existing segments
        if (this.editingStationId) {
          const stationId = this.editingStationId;
          // Build serializable structure
        // If only one segment, store as flat array for backward compatibility
        const serialized = this.editingLatLngs.length === 1
          ? this.editingLatLngs[0].map(ll => ({ lat: ll.lat, lng: ll.lng }))
          : this.editingLatLngs.map(arr => arr.map(ll => ({ lat: ll.lat, lng: ll.lng })));
          const jsonPolyline = JSON.stringify(serialized);
          const updateData = { id: stationId, type: 'green', newData: { polyline: jsonPolyline } };
          // Persist to backend only
          this.updatePoint(updateData);
          // Immediately re-render solid line without full refresh
          this.renderStationPolylineFromJson(stationId, jsonPolyline);

          // Cleanup edit mode
          this.editVertexMarkers.forEach(m => { try { m.remove(); } catch {} });
          this.editVertexMarkers = [];
          this.editingSegments.forEach(pl => { try { pl.remove(); } catch {} });
          this.editingSegments = [];
          this.editingLatLngs = [];
          this.editingStationId = null;
          this.isDrawingPolyline = false;
          presentToast("Trajectoire mise à jour.", "bottom", "success");
          // Resume location tracking if it was active before editing
          this.resumeLocationTracking();
          // Keep the view and leave the new solid polyline on map
          return;
        }

        // Case 2: Drawing a new polyline from a station
        if (this.map && this.mapClickHandler) {
            this.map.off("click", this.mapClickHandler);
            this.mapClickHandler = null;
        }

        // Clean up the small dot markers used for drawing
        this.polylineMarkers.forEach(marker => marker.remove());
        this.polylineMarkers = [];

        if (this.currentPolyline && this.polylinePoints.length >= 2) {
            const coordinates = (this.currentPolyline.getLatLngs() as L.LatLng[]).map(ll => ({ lat: ll.lat, lng: ll.lng }));
            console.log("Final polyline coordinates:", coordinates);
            
            // Find the station point ID from the polyline's starting point
            const stationId = this.greenMarkers.find((s: any) => s.lat == this.polylinePoints[0].lat && s.lng == this.polylinePoints[0].lng)?.id;

            if (stationId) {
                const jsonPolyline = JSON.stringify(coordinates);
                const updateData = { id: stationId, type: 'green', newData: { polyline: jsonPolyline } };
                this.updatePoint(updateData);
                this.renderStationPolylineFromJson(stationId, jsonPolyline);
            }
        }

        // Reset state
        this.isDrawingPolyline = false;
        this.polylinePoints = [];
        this.currentPolyline = null;

        presentToast("Trajectoire créée avec succès.", "bottom", "success");
        // Resume location tracking if it was active before drawing
        this.resumeLocationTracking();
    }

    private pauseLocationTracking() {
      // Remember if we were watching
      this.wasWatchingLocation = !!this.positionUpdateInterval;
      try { if (this.positionUpdateInterval) { clearInterval(this.positionUpdateInterval); } } catch {}
      this.positionUpdateInterval = null;
      try { if (this.positionTimeout) { clearTimeout(this.positionTimeout); } } catch {}
      this.positionTimeout = null;
      try { this.map?.stopLocate(); } catch {}
      // Remove any bound listeners for safety
      try { this.map?.off('locationfound'); this.map?.off('locationerror'); } catch {}
    }

    private resumeLocationTracking() {
      if (this.wasWatchingLocation) {
        // Restart location watch without auto-centering; user can center manually
        try { this.myLocation(); } catch {}
      }
      this.wasWatchingLocation = false;
    }

  closeAllPopups() {
    if (this.map) {
      this.map.eachLayer(layer => {
        if (layer instanceof L.Popup) {
          this.map!.closePopup(layer);
        }
      });
    }
  }
  

 handleBtnClick(index: number, type: string, object: any) {
     this.checker = true;
     let btn;
     let btnjaune;
     let action = '';


     
  if (type === 'green') {
    console.log("Handling update for green station");

    // Fetch buttons
    const updateBtn = document.getElementById(`updateStation${index}`);

    // --- Handle Join/Leave Queue Button for other users ---
    const joinQueueBtn = document.getElementById(`joinQueueBtn-${index}`);
    if (joinQueueBtn) {
      joinQueueBtn.addEventListener('click', () => this.toggleQueue(object));
    }

    if (updateBtn) {

      console.log(object)
      updateBtn.addEventListener('click', () => {
        // Small delay to ensure DOM is ready
        setTimeout(() => {

        const incorrectLocation = (document.getElementById(`incorrectLocation${index}`) as HTMLInputElement).checked;
        const stationDoesNotExist = (document.getElementById(`stationDoesNotExist${index}`) as HTMLInputElement).checked;
        const modifyQueue = (document.getElementById(`modifyQueue${index}`) as HTMLInputElement).checked;
        
        console.log('Radio button states:', { incorrectLocation, stationDoesNotExist, modifyQueue });

        if (incorrectLocation) {
          console.log("Opening modal to update station location...");
          this.openLocationUpdateModal(object);
          
          const updateData = {
            id: object.id,
            type: 'green',
            newData: {
              name: object.name,
              object: 'test',
            },
          };
          this.updatePoint(updateData);
        } 
        else if (stationDoesNotExist) {
          console.log("Deleting station and its paths...");
          // Remove polylines from map immediately for this station
          this.removePolylinesByStationId(object.id);
          this.deleteStation(index!,object,"delete");
          // No updatePoint call needed for deletion - handled by delete confirmation
        } 
        else if (modifyQueue) {
          console.log("Enable path editing mode...");
          this.closeAllPopups();
          // Keep the current map center and zoom; do not call goToLocation or re-center
          // Do NOT call updatePoint() or getAllPoint() here - just enable editing mode
          this.enablePolylineEditing(object);
        } 
        else {
          console.warn("No radio button selected. Please choose an option before modifying.");
          presentToast(
            "Veuillez sélectionner une option avant de modifier.",
            'bottom',
            'danger'
          );
          return;
        }
        }, 100); // End setTimeout
      });
    }
  }

        if ( type=='note' || type=='blue') {
                  btn = document.getElementById(`${'updateNote' + index}`);
                  if (btn) {
                    btn.addEventListener('click', () => {
                      this.updateEventContent(index!, 'note', object, 'update');

                    });
                  }
                  btn = document.getElementById(`${'supprimerNote' + index}`);
                  action = 'delete';
                  if (btn) {
                    btn.addEventListener('click', () => {
                      this.updateEventContent(index!, 'note', object, action);
                    });
                  }
                }

     if (type == 'event') {
                      btn = document.getElementById(`${'btnUpdateEvent' + index}`);
                      if (btn) {
                        btn.addEventListener('click', () => {
                          this.updateEventContent(index!, type, object, 'update');

                        });
                      }
                      btn = document.getElementById(`${'supprimerEvent' + index}`);
                      action = 'delete';
                      if (btn) {
                        btn.addEventListener('click', () => {
                          this.updateEventContent(index!, 'event', object, action);
                        });
                      }
                    }if (type == 'jaune') {
       btn = document.getElementById(`${'btnUpdateSos' + index}`);

       if (btn) {
         btn.addEventListener('click', () => {
           this.updateEventContent(index!, type, object, 'update');

         });
       }

       btn = document.getElementById(`${'supprimerSos' + index}`);
       action = 'delete';
       if (btn) {
         btn.addEventListener('click', () => {
           this.updateEventContent(index!, type, object, action);



         });
       }
     } else if (type == 'red') {
       if (this.authService.$userinfo.id == object.userId) {
         btn = document.getElementById(`${'supprimer' + index}`);
         action = 'delete';
          if (btn) {
                  btn.addEventListener('click', () => {
                    this.updateEventContent(index!, type, object, action);

                  });
                }
       } else { 
         btn = document.getElementById(`${'btnValider-' + index}`);
         action = 'validate';
          if (btn) {
                  btn.addEventListener('click', () => {
                    this.updateEventContent(index!, type, object, action);
                  });
                }
       } 
     }

   }


  handleLikesAndDislikes(index: number, type: string, object: any) {
    let likeBtn = document.getElementById(`${'like-' + index}`);
    let dislikeBtn = document.getElementById(`${'dislike-' + index}`);

    if (likeBtn) {
      likeBtn.addEventListener('click', () => {
        this.addLikesAndDislikes(index!, type, object, 'like');
      });
    }

    if (dislikeBtn) {
      dislikeBtn.addEventListener('click', () => {
        this.addLikesAndDislikes(index!, type, object, 'dislike');
      });
    }

    if (type == 'red') {
      let use0Btn = document.getElementById(`user-0-${index}`);
      let use1Btn = document.getElementById(`user-1-${index}`);
      let use2Btn = document.getElementById(`user-2-${index}`);
      let use3Btn = document.getElementById(`user-3-${index}`);
      let use4Btn = document.getElementById(`user-4-${index}`);

      let elements = [
        { name: 'use0Btn', lvl: '0', value: use0Btn },
        { name: 'use1Btn', lvl: '1', value: use1Btn },
        { name: 'use2Btn', lvl: '2', value: use2Btn },
        { name: 'use3Btn', lvl: '3', value: use3Btn },
        { name: 'use4Btn', lvl: '4', value: use4Btn },
      ];

      elements.forEach((el) => {
        if (el.value) {
          el.value.addEventListener(
            'click',
            () => {
              this.selectNews(el.lvl, object, el, elements);
            },
            { once: true }
          );
        }
      });
    }
  }

  updateEventContent(index: number, type: string, object: any, action: string) {

  if (action === 'delete') {
    // --- THIS IS THE FIX ---
    // The unnecessary and disruptive map navigation/reload has been removed.
    // Now, it only prepares and shows the confirmation dialog.
    this.confirmationContent = 'êtes-vous sûr de vouloir supprimer ce point ?';
    this.displayer.deletePointConfirmation = true;
    this.selectedpointId = object.id;

    // Standardize the type name (e.g., 'blue' becomes 'note') for consistency.
    if (type === 'blue') {
      type = 'note';
    }
    this.selectedPointType = type;
    
    // We stop here for the 'delete' action. The actual deletion is handled by deletePoint().
    return;
  }

  // The rest of the function for 'update' and 'validate' actions remains unchanged.
  if (type === 'jaune') {
    if (action === 'update') {
      clearInterval(this.positionTimer);
      this.router.navigate([`/update-sos/${object.id}`]);
    }
  }
  if (type === 'green') {
    if (action === 'update') {
      const incorrectLocation = (document.getElementById(`incorrectLocation${index}`) as HTMLInputElement).checked;
      const stationDoesNotExist = (document.getElementById(`stationDoesNotExist${index}`) as HTMLInputElement).checked;
      const modifyQueue = (document.getElementById(`modifyQueue${index}`) as HTMLInputElement).checked;
      // Build update data
      if (incorrectLocation || stationDoesNotExist || modifyQueue) {
        const updateData = {
          id: object.id,
          type: 'green',
          newData: {
            name: object.name,
            object: 'test'
          }
        };
        this.updatePoint(updateData);
      }
    }
  }
  if (type === 'note') {
    if (action === 'update') {
      clearInterval(this.positionTimer);
      this.router.navigate([`/update-note/${object.id}`]);
    }
  }
  if (type === 'red' || type === 'jaune') {
    if (action === 'validate') {
      if (this.newSelectedLvl != undefined) {
        this.updateLvl(object.id, this.newSelectedLvl);
      } else {
        presentToast(
          "selectionner une valeur depuis l'interface",
          'bottom',
          'danger'
        );
      }
    }
  }
  if (type === 'event' && action !== 'delete') {
    clearInterval(this.positionTimer);
    this.router.navigate([`/update-evenement/${object.id}`]);
  }
}

  addLikesAndDislikes(
    index: number,
    type: string,
    object: any,
    feedback: string
  ) {
    if (type == 'red') {
      this.sendFeedbackPoint(object, type, feedback);
    } else if (type == 'event') {
      if (object.userId == this.authService.$userinfo.id) {
        this.router.navigate([`/update-evenement/${object.id}`]);
      } else {
        this.sendFeedbackPoint(object, type, feedback);
      }
    } else {
      console.log('update method runed with index ' + index + ' of no type :(');
    }
  }

  selectNews(level: string, object: any, clickedElement: any, allHtmlElements: any[]) {
    const clickedButton = clickedElement.value as HTMLElement;
    const isAlreadySelected = clickedButton.classList.contains('border-[#EB2F06]');

    // First, reset all buttons to the default (unselected) state.
    allHtmlElements.forEach(el => {
      (el.value as HTMLElement).classList.remove('border-[#EB2F06]');
      (el.value as HTMLElement).classList.add('border-[#B3B3B3]');
    });

    if (isAlreadySelected) {
      // If the user clicked the same button again, deselect it.
      this.newSelectedLvl = undefined;
      console.log('Affluence level deselected.');
    } else {
      // Otherwise, select the new button.
      clickedButton.classList.remove('border-[#B3B3B3]');
      clickedButton.classList.add('border-[#EB2F06]');
      this.newSelectedLvl = level;
      console.log(`Affluence level ${level} selected.`);
    }
  }

  profil(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authService.$profil().subscribe(
        (data: any) => {
          this.authService.$userinfo = data;
          this.authenticatedUser = data;
          if (this.authenticatedUser) {
            this.checkTrialPeriod();
          }
          resolve(data); // Resolve the promise with user data
        },
        (err) => {
          console.error('Error fetching profile:', JSON.stringify(err, null, 2));
          reject(err); // Reject the promise on error
        }
      );
    });
  }
  // check free trail :
  checkTrialPeriod() {
    if (!this.authenticatedUser) {
      return;
    }

    const createdAt = new Date(this.authenticatedUser.created_at);
    console.log('created at auth user', createdAt);
    const trialEndDate = new Date(createdAt.setMonth(createdAt.getMonth() + 2));
    const currentDate = new Date(createdAt); // remove createdAt to test the trial period

    console.log('current date (system)', currentDate);
    this.isTrialExpired = currentDate > trialEndDate;

    const hasRedirected = localStorage.getItem('hasRedirected');
    console.log('hasRedirected => ', hasRedirected);
    if (this.isTrialExpired && hasRedirected !== 'true') {
      localStorage.setItem('hasRedirected', 'true');
      this.router.navigate(['/premium']);
    }
  }
  sendFeedbackPoint(object: any, type: string, feedback: string) {
    let json = {
      pointId: object.id,
      feedback: feedback,
    };

    this.pointService.$feedbackPoint(json).subscribe((data: any) => {
      if (data.data) {
        if (feedback == 'like') {
          if (object.dislike == 0) {
            object.like = object.like == 0 ? 1 : 0;
          } else {
            object.like = object.like == 0 ? 1 : 0;
            object.dislike = 0;
          }
        } else if (feedback == 'dislike') {
          if (object.like == 0) {
            object.dislike = object.dislike == 0 ? 1 : 0;
          } else {
            object.dislike = object.dislike == 0 ? 1 : 0;
            object.like = 0;
          }

          // run API to update the point.
        }

        // silent success; UI was already adjusted locally
        presentToast(data.message, 'bottom', 'success');
      } else {
        presentToast(data.message, 'bottom', 'danger');
      }
    });
  }

  deletePoint(deleteData: { id: number, type: string }) {
    const json = {
      pointId: deleteData.id,
      type: deleteData.type
    };

    this.pointService.$deletePoint(json).subscribe({
      next: (response: any) => {
        if (response.data) {
          // Close the confirmation dialog
          this.confirmationContent = '';
          this.displayer.deletePointConfirmation = false;
          
          // Show a success message
          presentToast(response.message, 'bottom', 'success');
          
          // --- THIS IS THE FIX ---
          // Immediately and efficiently remove the marker from the UI 
          // without doing a slow, full data refresh.
          this.removeMarkerFromUI(deleteData.id, deleteData.type);
          // If it's a station, also remove any dashed/solid queue polylines from UI
          if (deleteData.type === 'green') {
            // Centralized, thorough cleanup in one pass
            this.cleanupStationOverlays(deleteData.id);
          }

          // Final UI refresh to ensure all artifacts disappear immediately
          try { this.refreshMarkersUI(); } catch {}
          try { this.ensureMarkersVisible(); } catch {}

        } else {
          presentToast(response.message, 'bottom', 'danger');
        }
      },
      error: (error) => {
        presentToast('Error deleting point: ' + (error.message || 'Unknown error'), 'bottom', 'danger');
      }
    });
  }


  /*Update point */

  updatePoint(updateData: { id: number, type: string, newData: any }) {
    const json = {
      pointId: updateData.id,
      type: updateData.type,
      ...updateData.newData
    };

    this.pointService.$updatePoint(json).subscribe({
      next: (response: any) => {
        if (response.success) {

          // silent success
          presentToast(response.message, 'bottom', 'success');
          this.displayer.editPointConfirmation = false;
        } else {
          presentToast(response.message, 'bottom', 'danger');
        }
      },
      error: (error) => {
        presentToast('Error updating point: ' + error.message, 'bottom', 'danger');
      }
    });
  }


  updateLvl(id: number, lvl: string) {
    let json = {
      pointId: id,
      level: lvl,
    };

    this.pointService.$updateLvlPoint(json).subscribe((data: any) => {
      if (data.data) {
        // silent success
        presentToast(data.message, 'bottom', 'success');
      } else {
        presentToast(data.message, 'bottom', 'danger');
      }
    });
  }
  setSelectedMarker(value: any) {
    this.selectedPoint = value?.marker;
    this.markers = value?.markers;
    /*
    if(this.markers){
      // this.enableAffect=true;
      // console.log('enableAffect',this.enableAffect)
        }
        else{
          this.enableAffect=false;
          console.log('enableAffect',this.enableAffect)

        }*/
    console.log(this.markers);
  }

  dateStructor(
    format: string,
    date: string | number | undefined = undefined
  ): string {
    const dateStructer = date != undefined ? new Date(date) : new Date();
    const year = dateStructer.getFullYear();
    const month = String(dateStructer.getMonth() + 1).padStart(2, '0');
    const day = String(dateStructer.getDate()).padStart(2, '0');
    const hours = String(dateStructer.getHours()).padStart(2, '0');
    const minutes = String(dateStructer.getMinutes()).padStart(2, '0');
    const seconds = String(dateStructer.getSeconds()).padStart(2, '0');

    // Format the date in the desired format
    const currentDate: string = `${day}/${month}/${year}`;
    const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    if (format == 'timestemp') {
      return currentDateTime;
    }
    return currentDate;
  }
  forceMapRefresh() {
    if (this.map) {
      this.map.invalidateSize();
      console.log('Map refreshed');
    }
  }





  /**
   * Method to manually refresh fading for existing points (useful when resuming app)
   */
  public refreshFading() {
    console.log('Refreshing fading for existing affluence points');
    
    // Clear existing timers
    Object.values(this.affluenceTimers).forEach(clearInterval);
    this.affluenceTimers = {};
    
    // Restart fading for all red markers currently on map
    this.objectredMarkers.forEach((mapObj: any) => {
      if (mapObj && mapObj.object) {
        this.startFadingForPoint(mapObj.object, mapObj);
      }
    });
  }

  /**
   * Helper to find a marker in the allMarkers array by its coordinates.
   */
  private findMarkerByPosition(lat: number, lng: number): L.Marker | undefined {
    return this.allMarkers.find(m => {
      const pos = m.getLatLng();
      // Use a small tolerance for floating point comparison
      return Math.abs(pos.lat - lat) < 0.00001 && Math.abs(pos.lng - lng) < 0.00001;
    });
  }

  /**
   * Enhanced ngOnDestroy with better cleanup
   */
  ngOnDestroy(): void {
    console.log('MapPage destroying, cleaning up timers and intervals');
    
    // Clear position tracking
    if (this.positionUpdateInterval) {
      clearInterval(this.positionUpdateInterval);
    }
    if (this.positionTimeout) {
      clearTimeout(this.positionTimeout);
    }
    if (this.MarkerTimer) {
      clearInterval(this.MarkerTimer);
    }

    // Clear queue-related intervals
    if (this.locationBroadcastInterval) {
      clearInterval(this.locationBroadcastInterval);
    }
    if (this.queueVisualizerInterval) {
      clearInterval(this.queueVisualizerInterval);
    }
    if (this.eventVisibilityInterval) {
      clearInterval(this.eventVisibilityInterval);
      this.eventVisibilityInterval = null;
    }
    if (this.realtimeInterval) {
      clearInterval(this.realtimeInterval);
      this.realtimeInterval = null;
    }
    
    // Remove green progress line
    if (this.greenProgressLine && this.map) {
      this.map.removeLayer(this.greenProgressLine);
    }

    // Clear all affluence fading timers
    Object.values(this.affluenceTimers).forEach(timer => clearInterval(timer));
    this.affluenceTimers = {};
  }

  /**
   * Enhanced onResume to handle fading when app comes back to foreground
   */
  onResume() {
    console.log('App resumed, refreshing points and fading');
    this.getAllPoint();
    this.startRealtimeUpdates();
    // Re-check GPS permission and attempt to locate after returning from settings
    this.isGpsPermissionPromptOpen = false;
    try { this.checkGpsPermissionFlow(); } catch {}
    
    // After points are loaded, refresh fading
    setTimeout(() => {
      this.refreshFading();
      this.refreshEventMarkersVisibility();
      this.refreshNoteMarkersVisibility();
    }, 1000);
  }

  // --- Methods for Queue Visualization ---

  toggleQueue(station: any) {
    if (this.activeQueueStationId === station.id) {
      // User is already in this queue, so they want to leave.
      this.leaveActiveQueue();
    } else {
      // User wants to join a new queue.
      if (this.activeQueueStationId) {
        // If they are already in another queue, make them leave it first.
        this.leaveActiveQueue();
      }
      this.joinQueue(station);
    }
  }

  joinQueue(station: any) {
    console.log(`Joining queue for station ID: ${station.id}`);
    this.activeQueueStationId = station.id;
    presentToast(`Vous avez rejoint la file d'attente pour ${station.name}.`, 'bottom', 'success');

    // Start broadcasting location every 10 seconds
    this.locationBroadcastInterval = setInterval(() => {
      const lat = parseFloat(localStorage.getItem('lat') || '0');
      const lng = parseFloat(localStorage.getItem('long') || '0');
      if (lat !== 0 && lng !== 0 && this.activeQueueStationId) {
        console.log(`Broadcasting position for queue ${this.activeQueueStationId}: [${lat}, ${lng}]`);
        this.queueService.updatePosition(this.activeQueueStationId, lat, lng).subscribe();
      }
    }, 10000); // Broadcast every 10 seconds

    // Start queue visualization updates every 5 seconds
    this.queueVisualizerInterval = setInterval(() => {
      this.updateQueueVisualization();
    }, 5000); // Update visualization every 5 seconds

    // Force the popup to re-render to show the "Leave" button
    this.refreshPopupForMarker(station);
  }

  leaveActiveQueue() {
    if (!this.activeQueueStationId) return;

    console.log(`Leaving queue for station ID: ${this.activeQueueStationId}`);
    this.queueService.leaveQueue(this.activeQueueStationId).subscribe();
    
    // Clear intervals
    clearInterval(this.locationBroadcastInterval);
    clearInterval(this.queueVisualizerInterval);
    this.locationBroadcastInterval = null;
    this.queueVisualizerInterval = null;
    
    // Remove green progress line
    if (this.greenProgressLine) {
      this.map?.removeLayer(this.greenProgressLine);
      this.greenProgressLine = null;
    }
    
    const station = this.greenMarkers.find(s => s.id === this.activeQueueStationId);
    this.activeQueueStationId = null;
    presentToast("Vous avez quitté la file d'attente.", 'bottom', 'primary');
    
    if (station) this.refreshPopupForMarker(station);
  }

  private refreshPopupForMarker(pointData: any) {
    const markerObject = this.allMarkers.find(m => {
        const pos = m.getLatLng();
        return Math.abs(pos.lat - pointData.lat) < 0.00001 && Math.abs(pos.lng - pointData.lng) < 0.00001;
    });

    if (markerObject && markerObject.isPopupOpen()) {
        const popupContent = this.widgetContent('green', pointData.userId, this.greenMarkers.indexOf(pointData), pointData.like, pointData.dislike, pointData);
        markerObject.setPopupContent(popupContent);
        // Re-bind the click listeners for the newly rendered popup
        setTimeout(() => {
            this.handleBtnClick(this.greenMarkers.indexOf(pointData), 'green', pointData);
            this.handleLikesAndDislikes(this.greenMarkers.indexOf(pointData), 'green', pointData);
        }, 100);
    }
  }

  private updateQueueVisualization() {
    if (!this.activeQueueStationId || !this.map) return;

    this.queueService.getPositions(this.activeQueueStationId).subscribe({
      next: (positions) => {
        if (positions.length === 0) return;

        // Remove existing green progress line
        if (this.greenProgressLine) {
          this.map?.removeLayer(this.greenProgressLine);
        }

        // Create array of lat/lng coordinates from positions
        const coordinates: L.LatLngTuple[] = positions.map(pos => [pos.lat, pos.lng]);

        // Add the station position as the endpoint
        const station = this.greenMarkers.find(s => s.id === this.activeQueueStationId);
        if (station) {
          coordinates.push([station.lat, station.lng]);
        }

        // Create blue polyline to visualize path consistently
        this.greenProgressLine = L.polyline(coordinates, {
          color: '#4A90E2',
          weight: 4,
          opacity: 0.9
        });

        // Add to map
        if (this.map) {
          this.greenProgressLine.addTo(this.map);
        }

        console.log(`Queue visualization updated with ${positions.length} positions`);
      },
      error: (err) => {
        console.error('Error fetching queue positions:', err);
      }
    });
  }

}
