import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  constructor() { }
  faqdata = [
    {
      title : 'What is a CV?',
      text: ` CV is an abbreviation of the Latin words 'curriculum vitae', which mean 'life course'.
      A professional CV provides a summary and a good overview of someone's life.`,
      text1 : `Your CV includes your education(s) and qualifications, work experience, skills, and important qualities.
                By means of your CV, your potential employer will be able to get a good picture of your skills,
                work experience, and knowledge quickly, to assess whether or not you fit the job, and therefore
                 whether to offer you a job interview.`
    },
    {
      title : 'What is the difference between a cv and a resume?',
      text: ` The term resume is not so common in the United Kingdom, where the term cv is used.
               The term is more common in the United States and Canada.
               The documents, however, share a similar goal; landing a job interview
               for an employee and being able to see quickly whether a candidate is qualified for an open position for an employer.
                That said, there are a few key differences between a curriculum vitae and a resume`,
      text2: [{ list : `The length of the document;
              a cv is more elaborate, it usually covers two pages. A resume is usually no longer than one page.` } ,
             { list  : `The amount of detail; a cv is more detailed and complete,
                 where the resume focusses on only giving the most relevant
                 information for this specific application. Resulting in the aforementioned difference.`},
               { list : `The tone of the document; a resume can be a more commercial and focussed on selling one-self,
                where a cv is more factual.`}
             ],
    },
    {
      title : ' What should I include in my CV?',
      text: `  You should always start your CV with your personal details. At the very least,
                the following information must be mentioned: name, address, place of residence, email
                address, and telephone number(s). Optionally, you can also include the following
                information: a representative photograph, nationality, driving license, website,
                and any links to your social media profile(s) (such as LinkedIn, Facebook, etc.).`,
      text1:  `Next you should mention your experience. Examples of this include: education and
               qualifications, work experience, skills, languages, courses (training), internships,
              ancillary activities (e.g. voluntary work), references, hobbies, and (positive) characteristics.
              Optionally, you can also state here if you have obtained a certificate or diploma along with the year of receipt.`
    },
    {
      title : ' What should I include in my CV?',
      text: `  The most widely used CV is known as the Chronological CV.
               This means that time-dependent components, such as education and work experience,
               are represented in a reverse-chronological structure. Your last (most recent) job
               should be first (top), and your first job should be last (bottom).
               This also applies to all other experiences that you mention on your CV
               that took place within a certain period, such as study programs, courses,
               internships, and ancillary activities.`,
      text1:  `The order of your CV is then as follows: personal and contact details,
              followed by a concise personal profile about yourself. Hereafter, state your training,
              followed by any work experience, languages, skills, characteristics, and interests.`
    },
    {
      title : ' How to make your own CV (or application letter)',
      text: `  You can create a CV with your own word processing
                program such as Microsoft Word, and then convert it to PDF format.
                Search the Internet for a free CV example or CV template and see if
                you can replicate it. Or, use our CV maker where you can simply enter
                your data and your perfect CV will be available for download in just 15 minutes.
                Of course, the same can be done to create an accompanying application letter, too!`,
      text1:  `When you have completed your CV and application letter, you will be able to send both
               - along with an accompanying email - to the vacancy you wish to apply for.`
    },
    {
      title : ' Tips for creating your perfect CV',
      text: `  Within our CV maker page, you will find tips with each section to
               help make your CV the best it can be. Along with these, here are some general tips:`,
      text2: [  {
        list : `Only mention relevant information that will add value to the application for
            the vacancy you are applying for, or that will be of interest to future employers.`},
        { list : `Do not mention hobbies or interests that will raise awkward questions.`},
        {list : `State the most important information on the first page. Include a concise personal profile about yourself.`},
        {list : `Use bullet points and numbered lists to your advantage by making your CV transparent to recruiters`},
        {list : `Always choose the chronological CV structure, unless otherwise requested in the vacancy.`},
        {list : `Keep your CV short and powerful. Mention important information concisely.`},
        {list : `Keep an eye on our blog for more CV and job application tips!`}
      ]
    }
  ];
  ngOnInit() {
  }

}
