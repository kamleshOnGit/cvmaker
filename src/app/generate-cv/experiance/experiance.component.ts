import { Component, OnInit, Input , AfterViewChecked , DoCheck, ChangeDetectorRef } from '@angular/core';
import { FormcommunicationService} from '../formcommunication.service';
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
  selector: 'app-experiance',
  templateUrl: './experiance.component.html',
  styleUrls: ['./experiance.component.scss']
})
export class ExperianceComponent implements OnInit, AfterViewChecked {
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
  textinput;
  experiance2;
  experiance3;
  count = 0;
  count1 = 0;
  showTipsModal = false;
  experianceTips = [
    'Start each bullet point with a strong action verb (e.g., "Developed", "Managed", "Led")',
    'Include quantifiable achievements (e.g., "Increased sales by 25%")',
    'Keep descriptions concise - 3-5 bullet points per role',
    'Use industry-standard job titles for better ATS compatibility',
    'Include relevant keywords from the job description'
  ];
  constructor(private formservices: FormcommunicationService, private cdr: ChangeDetectorRef) { }
  @Input() exp: FormGroup;


  ngOnInit() {
    this.formservices.newcontroladded.subscribe( val => {
      if (val.get('experiance2')) {
        this.experiance2 = val.get('experiance2');
        this.cdr.detectChanges();
      } else if (val.get('experiance3')) {
        this.experiance3 = val.get('experiance3');
        this.cdr.detectChanges();
      }
    });

  }


  ngAfterViewChecked() {
    this.textinput = this.formservices.onChangesex;

    if (this.formservices.experiance2 === 'experiance2' && this.count === 0) {
      this.addextraexperiance() ;
      this.count = 1;
      console.log(this.formservices.experiance2);
  }
    if (this.formservices.experiance3 === 'experiance3' && this.count1 === 0) {
      this.addextraexperiance() ;
      this.count1 = 1 ;
      console.log(this.formservices.experiance3);
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
  addextraexperiance() {
  this.formservices.experiancefieldsublect.next(null);
  }
  deleteextra(identifier: string) {
    this.formservices.newcontrolremoved.next(identifier);
    if (identifier === 'experiance2') {
      this.experiance2 = null;
    }
    if (identifier === 'experiance3' ) {
      this.experiance3 = null;
    }
  }

  toggleTips() {
    this.showTipsModal = !this.showTipsModal;
  }
}
