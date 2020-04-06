import { Component, OnInit } from '@angular/core';
import { faMehRollingEyes , faSearch , faClipboardList} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-cv-features',
  templateUrl: './cv-features.component.html',
  styleUrls: ['./cv-features.component.scss']
})
export class CvFeaturesComponent implements OnInit {
  icona = faMehRollingEyes;
  iconb = faSearch;
  iconc = faClipboardList;
  constructor() { }

  content = [
    {
      title : 'Quick and easy',
      icon: this.icona,
      text: ` With our online CV maker, it is simple for anyone to quickly create a professional CV.
             Enter your personal details and begin filling out your CV content. Finally,
             choose one of our 36 available CV layouts, and download your CV.`
    },
    {
      title : 'More likely to land a job',
      icon:  this.iconb,
      text: ` With a representative and professional CV, you will stand out amongst all other applicants.
      You are also up to 65% more likely to be invited to an interview.`
    },
    {
      title : ' Organize your applications',
      icon:  this.iconc,
      text: `  Often, it is important to be able to tailor your CV based on the job you wish to apply for. With CV maker,
                you can create and manage several different CVs in an organised way through your own personal account hub.`
    }
  ];

  ngOnInit() {
  }

}
