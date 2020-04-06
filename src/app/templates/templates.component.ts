import { Component, OnInit, DoCheck } from '@angular/core';
import {TransferdataService} from '../transferdata.service';
@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit , DoCheck  {
  path = '../../assets/images/';
  constructor(private transfer: TransferdataService) { }

  showpopup = false;

  cvtemplateData = [
    {
     title : 'Auckland',
     image : 'cv-auckland-1.jpg',
     images: {
       title: 'Auckland',
       image1: 'cv-auckland-1.jpg',
       image2: 'cv-auckland-2.jpg'
     }
    },
    { title : 'Berkeley',
      image: 'cv-berkeley-1.jpg',
      images: {
       title : 'Berkeley',
       image1: 'cv-berkeley-1.jpg',
       image2: 'cv-berkeley-2.jpg',
       image3: 'cv-berkeley-3.jpg',
       image4: 'cv-berkeley-4.jpg'
      }
    },
    { title : 'Cambridge',
      image: 'cv-cambridge-1.jpg',
      images: {
        title : 'Cambridge',
        image1: 'cv-cambridge-1.jpg',
        image2: 'cv-cambridge-2.jpg',
        image3: 'cv-cambridge-3.jpg',
        image4: 'cv-cambridge-4.jpg',
        image5: 'cv-cambridge-5.jpg'
      }
    },
    { title : 'Edinburg',
      image: 'cv-edinburgh-1.jpg',
      images: {
        title : 'Edinburg',
        image1: 'cv-edinburgh-1.jpg',
        image2: 'cv-edinburgh-2.jpg',
        image3: 'cv-edinburgh-3.jpg',
        image4: 'cv-edinburgh-4.jpg',
        image5: 'cv-edinburgh-5.jpg'
      }
    },
    { title : 'Harvard',
      image: 'cv-harvard-1.jpg',
      images: {
        title : 'Harvard',
        image1: 'cv-harvard-1.jpg',
        image2: 'cv-harvard-2.jpg',
        image3: 'cv-harvard-3.jpg',
        image4: 'cv-harvard-4.jpg',
        image5: 'cv-harvard-5.jpg'
      }
    },
    { title: 'Otago',
      image: 'cv-otago-1.jpg',
      images: {
        title: 'Otago',
        image1: 'cv-otago-1.jpg',
        image2: 'cv-otago-2.jpg',
        image3: 'cv-otago-3.jpg',
        image4: 'cv-otago-4.jpg',
        image5: 'cv-otago-5.jpg'
      }
    },
    { title: 'Oxford',
      image: 'cv-oxford-1.jpg',
      images: {
        title: 'Oxford',
        image1: 'cv-oxford-1.jpg',
        image2: 'cv-oxford-2.jpg',
        image3: 'cv-oxford-3.jpg',
        image4: 'cv-oxford-4.jpg',
        image5: 'cv-oxford-5.jpg'
      }
    },
    { title : 'Princeton',
      image: 'cv-princeton-1.jpg',
      images: {
        title: 'Princeton',
        image1: 'cv-princeton-1.jpg',
        image2: 'cv-princeton-2.jpg',
        image3: 'cv-princeton-3.jpg',
        image4: 'cv-princeton-4.jpg',
        image5: 'cv-princeton-5.jpg'
       }
    },
    {  title: 'Standford',
      image: 'cv-standford-1.jpg',
      images: {
        title: 'Standford',
        image1: 'cv-standford-1.jpg',
        image2: 'cv-standford-2.jpg',
        image3: 'cv-standford-3.jpg',
        image4: 'cv-standford-4.jpg',
        image5: 'cv-standford-5.jpg'
      }
    }
  ];

  ngOnInit() {
  }

  passtransferdata(data) {
   this.transfer.popdata = data ;
   this.transfer.hidepopup = true;
   this.showpopup = true;
   console.log(this.showpopup);
  }

  ngDoCheck() {
    this.showpopup = this.transfer.hidepopup ;
  }

}
