import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import {FormcommunicationService} from '../formcommunication.service';
import {  FormGroup } from '@angular/forms';
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
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.scss']
})
export class InterestComponent implements OnInit , AfterViewChecked {
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
  interest2;
  interest3;
  count = 0;
  count1 = 0;
  constructor(private formservices: FormcommunicationService) { }
  @Input() interestdata: FormGroup;

  ngOnInit() {
    this.formservices.newcontroladded.subscribe( val => {
      if (val.get('interest2')) {
        this.interest2 = val.get('interest2');
      } else if (val.get('interest3')) {
        this.interest3 = val.get('interest3');
        this.formservices.count.next(1);
      }
    });
  }
  ngAfterViewChecked() {
    if (this.formservices.interest2 === 'interest2' && this.count === 0) {
      this.addextrainterest() ;
      this.count = 1;
      console.log(this.formservices.interest2);
  }
    if (this.formservices.interest3 === 'interest3' && this.count1 === 0) {
      this.addextrainterest() ;
      this.count1 = 1;
      console.log(this.formservices.interest3);
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
    addextrainterest() {
      this.formservices.interestfieldsublect.next();
    }
    deleteextra(identifier: string) {
      this.formservices.newcontrolremoved.next(identifier);
      if (identifier === 'interest2') {
        this.interest2 = null;
      }
      if (identifier === 'interest3' ) {
        this.interest3 = null;
      }
    }

}
