import { Component, OnInit } from '@angular/core';
import { faStar , faUser} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit {
  star = faStar;
  user = faUser;
  constructor() { }
  datatestimonials = [
    {
      title: 'Dylan',
      text: 'Undoubtedly, CVmaker was a great success for me. Within 15 minutes, I had created my CV and sent it with the email program.',
      role: 'Function Management'

    },
    {
      title: 'Jay',
      text: 'I received positive comments on my CV and found a great job very quickly. I certainly recommend CVmaker!',
      role: 'Function HR Manager'

    },
    {
      title: 'Kate',
      text: `I find it very handy that I can organise all of my CVs and applications in one place with CVmaker.
              It holds such beautiful CV templates!`,
      role: 'Function Marketing'

    }
  ];

  ngOnInit() {
  }


}
