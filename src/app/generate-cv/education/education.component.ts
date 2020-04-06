import { Component, OnInit, Input, DoCheck  , AfterViewChecked } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {FormcommunicationService} from '../formcommunication.service';
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
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit , AfterViewChecked {

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
  education2 = null;
  education3 = null;
  count = 0;
  count1 = 0;
  @Input()
  public edu: FormGroup;

  constructor(private formservices: FormcommunicationService) {
  }

  ngOnInit() {
    this.formservices.newcontroladded.subscribe( val => {

        if (val.get('education2')) {
          this.education2 = val.get('education2');
          console.log( this.education2);
        } else if (val.get('education3')) {
          this.education3 = val.get('education3');
          this.formservices.count.next(1);
          console.log( this.education3);
        }
    });


  }
  ngAfterViewChecked() {
    this.textinput = this.formservices.onChangesed;
    if (this.formservices.education2 === 'education2' && this.count === 0) {
      this.addextraeducation();
      this.count = 1;
      console.log(this.formservices.education2);
  }
    if (this.formservices.education3 === 'education3' && this.count1 === 0) {
      this.addextraeducation();
      this.count1 = 1;
      console.log(this.formservices.education3);
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
  addextraeducation() {
    this.formservices.educationfieldsublect.next();
  }
  deleteextra(identifier: string) {
    this.formservices.newcontrolremoved.next(identifier);
    if (identifier === 'education2') {
      this.education2 = null;
    }
    if (identifier === 'education3' ) {
      this.education3 = null;
    }
  }
}
