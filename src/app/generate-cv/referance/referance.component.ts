import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import { FormcommunicationService } from '../formcommunication.service';
import { FormGroup } from '@angular/forms';
import {

  faList,
  faUserCircle ,
  faUser ,
  faArrowDown ,
  faArrowUp ,
  faCog ,
  faChevronRight ,
  faChevronLeft,
  faLightbulb ,
  faSave ,
  faBriefcase ,
  faPlusCircle ,
  faPalette ,
  faCommentAlt ,
  faMousePointer ,
  faTrash ,
  faPen
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-referance',
  templateUrl: './referance.component.html',
  styleUrls: ['./referance.component.scss']
})
export class ReferanceComponent implements OnInit , AfterViewChecked {

  list = faList;
  user = faUserCircle;
  potrait = faUser;
  arrowup = faArrowUp;
  arrowdown = faArrowDown;
  gear = faCog;
  arrowright = faChevronRight;
  tip = faLightbulb;
  save = faSave;
  brifecase = faBriefcase;
  add = faPlusCircle;
  interest = faPalette;
  comment = faCommentAlt;
  skill = faMousePointer;
  delete = faTrash;
  pen = faPen;
  arrowleft = faChevronLeft ;
  reference2;
  reference3;
  count = 0;
  count1 = 0;
  constructor( private formservices: FormcommunicationService) { }
  @Input() ref: FormGroup;

  ngOnInit() {
    this.formservices.newcontroladded.subscribe( val => {
      if (val.get('reference2')) {
        this.reference2 = val.get('reference2');
      } else if (val.get('reference3')) {
        this.reference3 = val.get('reference3');
        this.formservices.count.next(1);
      }
    });
  }

  ngAfterViewChecked() {
    if (this.formservices.reference2 === 'reference2' && this.count === 0) {
      this.addextrareference() ;
      this.count = 1 ;
      console.log(this.formservices.reference2);
  }
    if (this.formservices.reference3 === 'reference3' && this.count1 === 0) {
      this.addextrareference() ;
      this.count1 = 1;
      console.log(this.formservices.reference3);
  }
  }

  up(identifier: string) {
    this.formservices.up(identifier);
   }
   down(identifier: string) {
     this.formservices.down(identifier);
    }

    setting(identifier: string) {
      this.formservices.setting(identifier);
    }
    addextrareference() {
      this.formservices.referencefieldsublect.next();
    }
    deleteextra(identifier: string) {
      this.formservices.newcontrolremoved.next(identifier);
      if (identifier === 'reference2') {
        this.reference2 = null;
      }
      if (identifier === 'reference3' ) {
        this.reference3 = null;
      }
    }
}
