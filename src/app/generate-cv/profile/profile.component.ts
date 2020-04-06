import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, AfterViewChecked } from '@angular/core';
import {FormcommunicationService} from '../formcommunication.service';
import { FormGroup } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit , AfterViewChecked {

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
  textinput = '';


  constructor(private formservices: FormcommunicationService , render: Renderer2) { }
  @Input()  prof: FormGroup;
  // @ViewChild('profiledata' )  profiledata: QuillEditorComponent;

  ngOnInit() {
    // this.textinput = this.formservices.formref.get('profile').controls.profiledata.value;
  }
  ngAfterViewChecked() {
      this.textinput = this.formservices.onChanges;
      // console.log(this.textinput );
      // this.textinput = this.textinput.replace(/\\n/g, '<br>/>');
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

}
