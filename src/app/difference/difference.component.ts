import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-difference',
  templateUrl: './difference.component.html',
  styleUrls: ['./difference.component.scss']
})
export class DifferenceComponent implements OnInit {

  constructor() { }

  differenceData = [
    {title : 'Create your own professional CV',
     diff : [
       {text: ` Making a professional CV is a piece of cake with our CV maker with tips and tricks.`},
       {text: ` Create your own professional CV that stands out in just 15 minutes.`},
       {text: ` Your CVs are stored in your own personal and safe account hub.
               This allows you to both edit and download your CVs whenever, and wherever, you require.`},
       {text: ` Gain access to creating strong application letters, matching them with your personal CV.`},
       {text: ` Access all functionalities for 7 days for only £2.95, then increasing to only £14.95 /mo.`}
     ]
    },
    {title: 'Have your CV either created or optimised',
     diff: [
       {text: ` Do you find it difficult to create your own CV? Or are you just too busy, and don't have the time?
               Then have your CV created or optimised by a professional.`},
       {text: ` Send us your current CV (or experiences) and we will make your CV in one of our professional templates.`},
       {text: ` Your content is professionally, powerfully, and clearly rewritten.`},
       {text: ` Within 24-48 hours, your CV is professionally created or optimised, and available to download from your personal account.`},
       {text: ` Free CV maker account allows you to continuously edit your generated CV,
                and make use of all other functionalities available.`}
     ]

    },
  ];

  ngOnInit() {
  }

}
