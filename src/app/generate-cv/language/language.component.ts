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
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit , AfterViewChecked {
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
  language2;
  language3;
  count = 0;
  count1 = 0;
  @Input()  languages: FormGroup;
  constructor(private formservices: FormcommunicationService) { }

  ngOnInit() {
    this.formservices.newcontroladded.subscribe( val => {
      if (val.get('language2')) {
        this.language2 = val.get('language2');
      } else if (val.get('language3')) {
        this.language3 = val.get('language3');
        this.formservices.count.next(1);
      }
    });
  }
  ngAfterViewChecked() {
    if (this.formservices.language2 === 'language2' && this.count === 0 ) {
      this.addextralanguage() ;
      this.count = 1;
      console.log(this.formservices.language2);
  }
    if (this.formservices.language3 === 'language3' && this.count1 === 0) {
      this.addextralanguage() ;
      this.count1 = 1;
      console.log(this.formservices.language3);
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
   addextralanguage() {
    this.formservices.languagefieldsublect.next();
  }
  deleteextra(identifier: string) {
    this.formservices.newcontrolremoved.next(identifier);
    if (identifier === 'language2') {
      this.language2 = null;
    }
    if (identifier === 'language3' ) {
      this.language3 = null;
    }
  }

}
