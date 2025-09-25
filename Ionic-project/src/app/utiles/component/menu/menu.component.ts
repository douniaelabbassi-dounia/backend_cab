import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { presentToast } from '../notification';
import { ProfilService } from '../../services/profil/profil.service';
import { URL_BASE } from 'src/environments/environment';
import { NavController } from '@ionic/angular';

@Component({
selector: 'app-menu',
templateUrl: './menu.component.html',
styleUrls: ['./menu.style.css'],
})
export class MenuComponent implements OnInit {
userinfo: any;
URL = URL_BASE; // TO USE THE URL ON TEMPLATE
imgCacheBust = Date.now();

@Input() menuDisplay: any;
@Input() timer: any;
@Input() markertimer: any;
@Output() removeAllMarkers = new EventEmitter();
@Output() closeMenu = new EventEmitter();
@Output() openNotesList = new EventEmitter<void>();
activeMenu: string | null = null;
constructor(
    private router: Router,
    private authService: ProfilService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.profil();
    this.userinfo = this.authService.$userinfo;
    console.log(this.userinfo);
  }
 


  toggleSubMenu(menuName: string) {
    this.activeMenu = this.activeMenu === menuName ? null : menuName;
  }
  close() {
    this.closeMenu.emit();
  }

  goPage(page: any) {
    this.navController.navigateForward(page);
    console.log('goto page ', page);
  }

  goTo(page: string) {
    switch (page) {
      case 'profil':
        this.path(page);
        break;

      case 'aeroports':
        this.path(page);
        break;
      case 'aeroport-attente':
        this.path(page);
        break;
      case 'list-evenement':
        this.path(page);
        break;
      case 'list-notes':
        // this.path(page);
        this.openNotesList.emit();
        this.close();
        break;

      case 'premium':
        this.path(page);
        break;

      case 'setting':
        this.path(page);
        break;

      case 'faq':
        this.path(page);
        break;

      case 'avis':
        this.path(page);
        break;

      case 'mention-legal':
        this.path(page);
        break;

      case 'info': // Nouvelle route ajoutée
        this.path(page);
        break;

      case 'logout':
        this.logout();
        break;

      default:
        break;
    }
  }

  path(page: string) {
    if (this.timer) {
      clearInterval(this.timer);
      clearInterval(this.markertimer);
    }
    this.router.navigate(['/' + page]);
  }

  profil() {
    this.authService.$profil().subscribe(
      (data: any) => {
        this.userinfo = data;
        this.authService.$userinfo = data;
        this.authService.$friendsList = data.friends;
        this.imgCacheBust = Date.now();
      },
      (err) => {
        console.log('error : ' + err.error.message);
      }
    );
  }

  logout() {
    if (this.timer) {
      clearInterval(this.timer);
      clearInterval(this.markertimer);
    }
    this.authService.$logout().subscribe(
      (date: any) => {
        if (date.message == 'ok') {
          this.removeAllMarkers.emit();
          localStorage.setItem('apiToken', '');
          this.authService.$friendsList = [];
          this.authService.$userinfo = undefined;
          this.router.navigate(['/sign-in'], { replaceUrl: true });
        }
      },
      (err) =>
        presentToast('error \n ' + err.error.message, 'bottom', 'danger')
    );
  }

  save() {
    presentToast('not developed yet!', 'bottom', 'danger');
  }

  imageSrc(path?: string): string {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) {
      const sep = path.includes('?') ? '&' : '?';
      return path + sep + 'v=' + this.imgCacheBust;
    }
    const host = this.URL.replace(/\/(api|api\/)$/, '/');
    const url = host + 'storage/' + String(path).replace(/^\/*/, '');
    const sep = url.includes('?') ? '&' : '?';
    return url + sep + 'v=' + this.imgCacheBust;
  }
}
