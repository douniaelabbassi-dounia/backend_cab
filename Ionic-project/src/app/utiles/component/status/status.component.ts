import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { presentToast } from '../notification';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent implements OnInit {
  @Input() statusDisplay: any;
  @Output() closeStatus = new EventEmitter();
  @Output() validateStation = new EventEmitter<string>();

  station: string = ''; // Station name input
  constructor() { }

  ngOnInit(): void { }

  // Close the modal
  close(): void {
    this.closeStatus.emit();
  }

  // Validate the selected station
  validate(): void {
    if (this.station.trim()) {
      this.validateStation.emit(this.station.trim());
      this.close();
    } else {
      presentToast("Veuillez entrer un nom pour la station.", "bottom", "danger");
    }
  }

}
