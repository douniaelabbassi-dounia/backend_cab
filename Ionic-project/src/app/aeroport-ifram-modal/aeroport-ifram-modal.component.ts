
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-aeroport-ifram-modal',
  templateUrl: './aeroport-ifram-modal.component.html',
  styleUrls: ['./aeroport-ifram-modal.component.scss'],
  
})
export class AeroportIframModalComponent implements OnInit {
  safeUrl!: SafeResourceUrl;
  private url: string = 'https://infotaxi.parisaeroport.fr';

  constructor(private router: Router,private modalController: ModalController, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
  navigateToRoot() {
    this.router.navigate(['/map']);
  }
}
