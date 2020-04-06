import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import { FormcommunicationService } from '../formcommunication.service' ;
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
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit , AfterViewChecked {

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
  skills2;
  skills3;
  count = 0;
  count1 = 0;
  constructor(private formservices: FormcommunicationService) { }
  @Input() skills: FormGroup;
  ngOnInit() {
    this.formservices.newcontroladded.subscribe( val => {
      if (val.get('skills2')) {
        this.skills2 = val.get('skills2');
      } else if (val.get('skills3')) {
        this.skills3 = val.get('skills3');
        this.formservices.count.next(1);
      }
    });
  }

  ngAfterViewChecked() {
    if (this.formservices.skill2 === 'skill2' && this.count === 0) {
      this.addextraskill() ;
      this.count = 1;
      console.log(this.formservices.skill2);
  }
    if (this.formservices.skill3 === 'skill3' && this.count1 === 0) {
      this.addextraskill() ;
      this.count1 = 1;
      console.log(this.formservices.skill3);
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
  addextraskill() {
    this.formservices.skillfieldsublect.next();
  }
  deleteextra(identifier: string) {
    this.formservices.newcontrolremoved.next(identifier);
    if (identifier === 'skills2') {
      this.skills2 = null;
    }
    if (identifier === 'skills3' ) {
      this.skills3 = null;
    }
  }

}
