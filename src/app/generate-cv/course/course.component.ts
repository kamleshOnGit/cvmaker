import { Component, OnInit , Input, AfterViewChecked } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormcommunicationService } from '../formcommunication.service';
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
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit , AfterViewChecked {

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
  courses2;
  courses3;
  count = 0;
  count1 = 0;
  @Input() courses: FormGroup;
  constructor( private formservices: FormcommunicationService) { }

  ngOnInit() {
    this.formservices.newcontroladded.subscribe( val => {
      if (val.get('courses2')) {
        this.courses2 = val.get('courses2');
      } else if (val.get('courses3')) {
        this.courses3 = val.get('courses3');
        this.formservices.count.next(1);
      }
    });
  }

ngAfterViewChecked() {
  if (this.formservices.course2 === 'course2' && this.count === 0) {
    this.addextracourse() ;
    this.count = 1;
    console.log(this.formservices.course2);
}
  if (this.formservices.course3 === 'course3' && this.count1 === 0) {
    this.addextracourse() ;
    this.count1 = 1;
    console.log(this.formservices.course3);
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
   addextracourse() {
    this.formservices.coursefieldsublect.next();
  }
  deleteextra(identifier: string) {
    this.formservices.newcontrolremoved.next(identifier);
    if (identifier === 'courses2') {
      this.courses2 = null;
    }
    if (identifier === 'courses3' ) {
      this.courses3 = null;
    }
  }

}
