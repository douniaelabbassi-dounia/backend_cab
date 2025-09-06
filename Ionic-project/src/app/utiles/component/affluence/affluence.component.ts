import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-affluence',
  templateUrl: './affluence.component.html',
  styleUrls: ['./affluence.component.scss'],
})
export class AffluenceComponent  implements OnInit {
  @Input() affluenceDisplay:any;
  @Output() closeAffluence =new EventEmitter()
  @Output() addAffluence =new EventEmitter()

  choice:number|null = null
  constructor() { }

  ngOnInit() {}

  close(){
    this.closeAffluence.emit();
  }

  valider(){
    if(this.choice != null){
      this.addAffluence.emit(this.choice)
      this.closeAffluence.emit();
    }
  }

  selectChoice(selectedChoice:number){
    this.choice = selectedChoice;
    console.log('selected choice',this.choice)
  }
  deleteAffluence() {
    this.choice = null;
    console.log('Affluence deleted');
  }
}
