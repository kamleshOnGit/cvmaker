import { Component, OnInit, Input, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
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
  extraReferences = [];
  count = 0;
  count1 = 0;
  showTipsModal = false;
  referenceTips = [
    'Always ask permission before listing someone as a reference',
    'Choose professional references (managers, colleagues) over personal ones',
    'Provide complete contact information: name, title, company, phone, email',
    'Ensure your references know about the job you\'re applying for',
    'Keep your reference list updated with current contact details'
  ];
  constructor( private formservices: FormcommunicationService, private cdr: ChangeDetectorRef) { }
  @Input() ref: FormGroup;

  ngOnInit() {
    this.formservices.newcontroladded.subscribe( val => {
      if (val.get('reference2')) {
        this.reference2 = val.get('reference2');
      } else if (val.get('reference3')) {
        this.reference3 = val.get('reference3');
      }
      this.refreshExtraReferences();
      this.cdr.detectChanges();
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
      this.formservices.referencefieldsublect.next(null);
    }
    deleteextra(identifier: string) {
      this.formservices.newcontrolremoved.next(identifier);
      if (identifier === 'reference2') {
        this.reference2 = null;
      }
      if (identifier === 'reference3' ) {
        this.reference3 = null;
      }
      this.refreshExtraReferences();
    }

    refreshExtraReferences() {
      this.extraReferences = [];
      for (let i = 4; i <= 5; i++) {
        const key = 'reference' + i;
        const group = this.formservices.formref.get(key)?.get(key);
        if (group) {
          this.extraReferences.push({ key, group });
        }
      }
    }

    toggleTips() {
      this.showTipsModal = !this.showTipsModal;
    }
}
