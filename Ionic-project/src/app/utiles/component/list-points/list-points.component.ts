import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ListPointsService } from '../../services/points/list-points.service';

@Component({
  selector: 'app-list-points',
  templateUrl: './list-points.component.html',
  styleUrls: ['./list-points.component.scss'],
})
export class ListPointsComponent  implements OnInit {
  @Input() listPointsDisplay:any;
  @Output() closelistPoints= new EventEmitter();

  listPoints:any;

  constructor(private pointtsServeces:ListPointsService) { }

  ngOnInit() {
    this.listPoints = this.pointtsServeces.$listPoint;
  }



  close(){
    this.closelistPoints.emit();
  }
}
