import { Component, OnInit, Input, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
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
  extraSkills = [];
  count = 0;
  count1 = 0;
  showTipsModal = false;
  skillsTips = [
    'List skills that are relevant to the job you\'re applying for',
    'Include both technical skills (e.g., programming languages) and soft skills (e.g., leadership)',
    'Be specific - instead of "computers", list "Microsoft Excel" or "Python"',
    'Rate your skills honestly - only mark as "Expert" if you truly are',
    'Consider including certifications or years of experience for key skills'
  ];
  constructor(private formservices: FormcommunicationService, private cdr: ChangeDetectorRef) { }
  @Input() skills: FormGroup;
  ngOnInit() {
    this.formservices.newcontroladded.subscribe( val => {
      if (val.get('skills2')) {
        this.skills2 = val.get('skills2');
      } else if (val.get('skills3')) {
        this.skills3 = val.get('skills3');
      }
      this.refreshExtraSkills();
      this.cdr.detectChanges();
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
    this.formservices.skillfieldsublect.next(null);
  }
  deleteextra(identifier: string) {
    this.formservices.newcontrolremoved.next(identifier);
    if (identifier === 'skills2') {
      this.skills2 = null;
    }
    if (identifier === 'skills3' ) {
      this.skills3 = null;
    }
    this.refreshExtraSkills();
  }

  refreshExtraSkills() {
    this.extraSkills = [];
    for (let i = 4; i <= 100; i++) {
      const key = 'skills' + i;
      const group = this.formservices.formref.get('skills')?.get(key);
      if (group) {
        this.extraSkills.push({ key, group });
      }
    }
  }

  toggleTips() {
    this.showTipsModal = !this.showTipsModal;
  }

}
