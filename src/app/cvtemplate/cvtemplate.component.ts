import { Component, OnInit , AfterViewChecked, ViewChild , ElementRef , ViewEncapsulation} from '@angular/core';
import { FormcommunicationService } from '../generate-cv/formcommunication.service';
import * as jspdf from 'jspdf';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cvtemplate',
  templateUrl: './cvtemplate.component.html',
  styleUrls: ['./cvtemplate.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CvtemplateComponent implements OnInit , AfterViewChecked {

  constructor(private formservices: FormcommunicationService , private router: Router , private cookieService: CookieService ) { }
  profilepic;
  formdata = {};
  popup = 'auckland';
  togglepopup = false;

  @ViewChild('printcv') printcv: ElementRef;



  ngOnInit() {
    this.profilepic = this.formservices.profilepic;
    this.formdata = this.formservices.formdata;

  }
  ngAfterViewChecked() {
    console.log(this.formdata , this.profilepic );
  }

  showpopup(identifier: string) {
    this.togglepopup = true;
    this.popup = identifier;
    console.log(this.togglepopup, identifier , this.printcv);
  }
  toggleOptions() {
    this.togglepopup = false;
  }
  closepopup() {
    this.togglepopup = false;
  }

  makePdf() {
    const doc = new jspdf('p', 'mm' , 'A4');
    const options = {
      pagesplit: true
   };
    doc.addHTML(this.printcv.nativeElement, 0, 0, options , () => {
       doc.save('resume.pdf');
    });

  }

  editData() {
  const cookie = JSON.stringify(this.formdata);
  // const profilepic = JSON.stringify(this.profilepic);
  this.cookieService.set('prefillformdata' , cookie );
  localStorage.setItem('profilepic' , this.profilepic);
  this.router.navigate(['../genrateCv']);
  }


}
