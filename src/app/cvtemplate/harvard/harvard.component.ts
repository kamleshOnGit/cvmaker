import { Component, OnInit , ViewEncapsulation , Input , Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-harvard',
  templateUrl: './harvard.component.html',
  styleUrls: ['./harvard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HarvardComponent implements OnInit {
  @Input() formdata: any;
  @Input() profilepic: any;
  @Output() popup = new EventEmitter <string>() ;
  interest = '';
  languages = '';
  profile = '';
  education = '';
  education2 = '' ;
  education3 = '';
  experiance = '';
  experiance2 = '';
  experiance3 = '';
  skills = '';
  skills2 = '';
  skills3 = '';
  courses = '' ;
  courses2 = '';
  courses3 = '';
  constructor() { }

  ngOnInit() {
    this.interest = this.formdata.interest;
    this.languages = this.formdata.languages;
    this.profile = this.formdata.profile;
    this.education = this.formdata.education;
    this.education2 = this.formdata.education2;
    this.education3 = this.formdata.education3;
    this.experiance = this.formdata.experiance;
    this.experiance2 = this.formdata.experiance2;
    this.experiance3 = this.formdata.experiance3;
    this.skills = this.formdata.skills;
    this.skills2 = this.formdata.skills2;
    this.skills3 = this.formdata.skills3;
    this.courses = this.formdata.courses;
    this.courses2 = this.formdata.courses2;
    this.courses3 = this.formdata.courses3;
  }

  showpopup(identifier: string) {
    this.popup.emit(identifier);
  }

}
