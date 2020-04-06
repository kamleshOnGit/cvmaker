import { Injectable, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import {Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormcommunicationService {
  languagefieldsublect = new Subject<any>();
  skillfieldsublect = new Subject<any>();
  experiancefieldsublect = new Subject<any>();
  educationfieldsublect = new Subject<any>();
  referencefieldsublect = new Subject<any>();
  coursefieldsublect = new Subject<any>();
  interestfieldsublect = new Subject<any>();
  newcontroladded = new Subject<any>();
  newcontrolremoved = new Subject<any>();
  count = new Subject<any>();
  count1 = new Subject<any>();
  count2 = new Subject<any>();
  count3 = new Subject<any>();
  count4 = new Subject<any>();
  count5 = new Subject<any>();
  count6 = new Subject<any>();
  refillform = new Subject<any>();
  language2 = '';
  language3 = '';
  course2 = '';
  course3 = '';
  skill2 = '';
  skill3 = '';
  experiance2 = '';
  experiance3 = '';
  education2 = '';
  education3 = '';
  interest2 = '';
  interest3 = '';
  reference2 = '';
  reference3 = '';

  constructor() { }
  formchild;
  forlength;
  render;
  formref;
  onChanges;
  onChangesed;
  onChangesex;
  settings = false;
  identifier = '';
  profilepic;
  formdata;
  @Output() changeview: EventEmitter<object> =  new EventEmitter();
  refchild = (identifier: string) => {};


  up(identifier: any) {
    let itemact ;
    let itemup ;
    let itemdn ;
    // console.log(this.formchild , this.forlength , this.render );
    for ( let i = 0 ;  i < this.forlength.length; i++) {
      if ( this.formchild.children.item(i).classList.contains(identifier) ) {
        itemact = this.forlength.item(i) ;
        itemup = this.forlength.item(i - 1);
        itemdn = this.forlength.item(i + 1);
        // console.log(itemact);
      }
    }
    switch (true) {
      case (identifier === 'profile') :
      this.render.insertBefore(this.formchild , itemact , itemup);
      break;
      case (identifier === 'experiance') :
      this.render.insertBefore(this.formchild , itemact , itemup);
      break;
      case (identifier === 'education') :
      this.render.insertBefore(this.formchild , itemact , itemup);
      break;
      case (identifier === 'interest') :
      this.render.insertBefore(this.formchild , itemact , itemup);
      break;
      case (identifier === 'reference')  :
      this.render.insertBefore(this.formchild , itemact, itemup);
      break;
      case (identifier === 'skills') :
      this.render.insertBefore(this.formchild , itemact , itemup);
      break;
      case (identifier === 'courses') :
      this.render.insertBefore(this.formchild , itemact , itemup);
      break;
      case (identifier === 'languages') :
      this.render.insertBefore(this.formchild , itemact , itemup);
      break;
    }
  }

  down(identifier: any) {
    let itemact ;
    let itemup ;
    let itemdn ;

    for ( let i = 0 ;  i < this.forlength.length; i++) {
      if ( this.formchild.children.item(i).classList.contains(identifier) ) {
        itemact = this.forlength.item(i) ;
        itemup = this.forlength.item(i - 1);
        itemdn = this.forlength.item(i + 1);
        // console.log(itemact , itemup , itemdn);
      }
    }
    switch (true) {
      case (identifier === 'profile') :
      this.render.insertBefore(this.formchild , itemact , itemdn.nextSibling);
      break;
      case (identifier === 'experiance') :
      this.render.insertBefore(this.formchild , itemact , itemdn.nextSibling);
      break;
      case (identifier === 'education') :
      this.render.insertBefore(this.formchild , itemact , itemdn.nextSibling);
      break;
      case (identifier === 'interest') :
      this.render.insertBefore(this.formchild , itemact , itemdn.nextSibling);
      break;
      case (identifier === 'reference')  :
      this.render.insertBefore(this.formchild , itemact , itemdn.nextSibling);
      break;
      case (identifier === 'skills') :
      this.render.insertBefore(this.formchild , itemact , itemdn.nextSibling);
      break;
      case (identifier === 'courses') :
      this.render.insertBefore(this.formchild , itemact , itemdn.nextSibling);
      break;
      case (identifier === 'languages') :
      this.render.insertBefore(this.formchild, itemact , itemdn.nextSibling);
      break;
    }
  }

  showpopup() {
  this.settings = !this.settings;
  }

  setting(identifier: string) {
  this.showpopup();
  this.identifier = identifier;
  }
  hidesection() {
    this.changeview.emit({flag: false , name: this.identifier});
  }


}

