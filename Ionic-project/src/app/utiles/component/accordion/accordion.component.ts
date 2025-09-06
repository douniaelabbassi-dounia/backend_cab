import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent  implements OnInit {

  @Input() content:{title:string, message:string} = {title:"", message:""};

  isOpened:boolean = false;
  constructor() { }

  ngOnInit() {}

  accordionToggle(element:any){
    this.isOpened = !this.isOpened;
    
  }

}
