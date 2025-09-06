import { Injectable } from '@angular/core';
import { Aeroport } from '../../interface/aeroport';

@Injectable({
  providedIn: 'root'
})
export class AeroportService {
  $listAeropot:Array<Aeroport> = [
    {
      id:1,
      name:'Aéroport Charle de Gaulle',
      shortName:'CDG',
      nbFile:'1',
      nbVan:'1',
      attBAT:'1 min',
      attTotal:'20min',
      tendance:'bad',
      leavethirty:'45',
      enterthirty:'33',
    },
    {
      id:2,
      name:'Aéroport Orly',
      shortName:'ORLY',
      nbFile:'7,3G et 3P',
      nbVan:'6',
      attBAT:'1h20min',
      attTotal:'2h10min',
      tendance:'good',
      leavethirty:'22',
      enterthirty:'40',
    }
  ]

  constructor() { }

}