import { Injectable } from '@angular/core';
import {Popupdata} from './template-popup/template-popup.model';

@Injectable({
  providedIn: 'root'
})
export class TransferdataService {

  popdata: Popupdata ;
  hidepopup = false;

  constructor() { }

   returndata() {
     return this.popdata;
   }

   hidepopupMethod(data) {
     this.hidepopup = data;
   }

}
