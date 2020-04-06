import { Component, OnInit, HostListener, Input, DoCheck } from '@angular/core';
import { TransferdataService } from '../transferdata.service';
import { element } from 'protractor';
import {Popupdata} from './template-popup.model';

@Component({
  selector: 'app-template-popup',
  templateUrl: './template-popup.component.html',
  styleUrls: ['./template-popup.component.scss']
})
export class TemplatePopupComponent implements OnInit , DoCheck {

  popup: Popupdata = {
    title : 'Cambridge',
    image1: 'cv-cambridge-1.jpg',
    image2: 'cv-cambridge-2.jpg',
    image3: 'cv-cambridge-3.jpg',
    image4: 'cv-cambridge-4.jpg',
    image5: 'cv-cambridge-5.jpg'
  };

  path1 = '../../assets/images/' ;
  path2 = '../../assets/images/' ;
  path3 = '../../assets/images/' ;
  path4 = '../../assets/images/' ;
  path5 = '../../assets/images/' ;


  popupvalue = 'image1';


  constructor(private popupservices: TransferdataService ) { }

  ngOnInit() {
    this.popup = this.popupservices.returndata();
  }

  ngDoCheck(): void {
  // console.log(this.popupvalue , this.popup.image1);
  this.path1 = '../../assets/images/' + this.popup.image1;
  this.path2 = '../../assets/images/' + this.popup.image2;
  this.path3 = '../../assets/images/' + this.popup.image3;
  this.path4 = '../../assets/images/' + this.popup.image4;
  this.path5 = '../../assets/images/' + this.popup.image5;
  }

  dismispopup(data) {
    this.popupservices.hidepopupMethod(data);
    console.log(data , this.popup);
  }



}
