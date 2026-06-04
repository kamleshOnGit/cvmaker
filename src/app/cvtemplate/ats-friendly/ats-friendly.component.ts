import { Component, OnInit, Input } from '@angular/core';

// ATS-Optimized Resume Template
// Single column, clean formatting, standard fonts, keyword-rich sections
@Component({
  selector: 'app-ats-friendly',
  template: `
    <div class="ats-resume" id="ats-resume">
      <!-- Header - Contact Information -->
      <header class="ats-header">
        <h1 class="ats-name">
          {{formdata?.personal?.firstName}} {{formdata?.personal?.secondName}}
        </h1>
        <div class="ats-contact">
          <span class="contact-item" *ngIf="formdata?.personal?.email">
            Email:
            {{formdata?.personal?.email}}
          </span>
          <span class="contact-item" *ngIf="formdata?.personal?.phone">
            Phone:
            {{formdata?.personal?.phone}}
          </span>
          <span class="contact-item" *ngIf="formdata?.personal?.city || formdata?.personal?.country">
            Location:
            {{formdata?.personal?.city}}{{formdata?.personal?.city && formdata?.personal?.country ? ', ' : ''}}{{formdata?.personal?.country}}
          </span>
          <span class="contact-item" *ngIf="formdata?.personal?.linkedin">
            LinkedIn:
            {{formdata?.personal?.linkedin}}
          </span>
        </div>
      </header>

      <!-- Professional Summary -->
      <section class="ats-section" *ngIf="formdata?.profile?.profiledata">
        <h2 class="ats-section-title">PROFESSIONAL SUMMARY</h2>
        <div class="ats-content" [innerHTML]="formdata?.profile?.profiledata"></div>
      </section>

      <!-- Skills Section - ATS Optimized -->
      <section class="ats-section" *ngIf="hasSkills()">
        <h2 class="ats-section-title">TECHNICAL SKILLS AND COMPETENCIES</h2>
        <div class="ats-skills">
          <div class="skill-category" *ngIf="formdata?.skills?.skill1">
            <strong>Core Skills:</strong>
            {{formdata?.skills?.skill1?.skill}} ({{formdata?.skills?.skill1?.level}})
            <span *ngIf="formdata?.skills2?.skills2">,
              {{formdata?.skills2?.skills2?.skill}} ({{formdata?.skills2?.skills2?.level}})</span>
            <span *ngIf="formdata?.skills3?.skills3">,
              {{formdata?.skills3?.skills3?.skill}} ({{formdata?.skills3?.skills3?.level}})</span>
          </div>
        </div>
      </section>

      <!-- Professional Experience -->
      <section class="ats-section" *ngIf="hasExperience()">
        <h2 class="ats-section-title">PROFESSIONAL EXPERIENCE</h2>

        <!-- Experience 1 -->
        <div class="ats-experience" *ngIf="formdata?.experiance?.experiance1">
          <div class="exp-header">
            <h3 class="exp-title">{{formdata?.experiance?.experiance1?.jobTitle}}</h3>
            <div class="exp-company">{{formdata?.experiance?.experiance1?.employer}}</div>
            <div class="exp-location">{{formdata?.experiance?.experiance1?.city}}</div>
            <div class="exp-date">
              {{formdata?.experiance?.experiance1?.startDate?.month}}
              {{formdata?.experiance?.experiance1?.startDate?.year}} -
              <span *ngIf="formdata?.experiance?.experiance1?.endDate?.month">
                {{formdata?.experiance?.experiance1?.endDate?.month}}
                {{formdata?.experiance?.experiance1?.endDate?.year}}
              </span>
              <span *ngIf="!formdata?.experiance?.experiance1?.endDate?.month">Present</span>
            </div>
          </div>
          <div class="exp-description" [innerHTML]="formdata?.experiance?.experiance1?.description"></div>
        </div>

        <!-- Experience 2 -->
        <div class="ats-experience" *ngIf="formdata?.experiance2?.experiance2">
          <div class="exp-header">
            <h3 class="exp-title">{{formdata?.experiance2?.experiance2?.jobTitle}}</h3>
            <div class="exp-company">{{formdata?.experiance2?.experiance2?.employer}}</div>
            <div class="exp-location">{{formdata?.experiance2?.experiance2?.city}}</div>
            <div class="exp-date">
              {{formdata?.experiance2?.experiance2?.startDate?.month}}
              {{formdata?.experiance2?.experiance2?.startDate?.year}} -
              <span *ngIf="formdata?.experiance2?.experiance2?.endDate?.month">
                {{formdata?.experiance2?.experiance2?.endDate?.month}}
                {{formdata?.experiance2?.experiance2?.endDate?.year}}
              </span>
              <span *ngIf="!formdata?.experiance2?.experiance2?.endDate?.month">Present</span>
            </div>
          </div>
          <div class="exp-description" [innerHTML]="formdata?.experiance2?.experiance2?.description"></div>
        </div>

        <!-- Experience 3 -->
        <div class="ats-experience" *ngIf="formdata?.experiance3?.experiance3">
          <div class="exp-header">
            <h3 class="exp-title">{{formdata?.experiance3?.experiance3?.jobTitle}}</h3>
            <div class="exp-company">{{formdata?.experiance3?.experiance3?.employer}}</div>
            <div class="exp-location">{{formdata?.experiance3?.experiance3?.city}}</div>
            <div class="exp-date">
              {{formdata?.experiance3?.experiance3?.startDate?.month}}
              {{formdata?.experiance3?.experiance3?.startDate?.year}} -
              <span *ngIf="formdata?.experiance3?.experiance3?.endDate?.month">
                {{formdata?.experiance3?.experiance3?.endDate?.month}}
                {{formdata?.experiance3?.experiance3?.endDate?.year}}
              </span>
              <span *ngIf="!formdata?.experiance3?.experiance3?.endDate?.month">Present</span>
            </div>
          </div>
          <div class="exp-description" [innerHTML]="formdata?.experiance3?.experiance3?.description"></div>
        </div>
      </section>

      <!-- Education -->
      <section class="ats-section" *ngIf="hasEducation()">
        <h2 class="ats-section-title">EDUCATION</h2>

        <div class="ats-education" *ngIf="formdata?.education?.education1">
          <div class="edu-degree">{{formdata?.education?.education1?.degree}}</div>
          <div class="edu-school">{{formdata?.education?.education1?.school}}</div>
          <div class="edu-location">{{formdata?.education?.education1?.city}}</div>
          <div class="edu-date">
            {{formdata?.education?.education1?.startDate?.month}}
            {{formdata?.education?.education1?.startDate?.year}} -
            {{formdata?.education?.education1?.endDate?.month}}
            {{formdata?.education?.education1?.endDate?.year}}
          </div>
          <div class="edu-description" [innerHTML]="formdata?.education?.education1?.description"></div>
        </div>

        <div class="ats-education" *ngIf="formdata?.education2?.education2">
          <div class="edu-degree">{{formdata?.education2?.education2?.degree}}</div>
          <div class="edu-school">{{formdata?.education2?.education2?.school}}</div>
          <div class="edu-location">{{formdata?.education2?.education2?.city}}</div>
          <div class="edu-date">
            {{formdata?.education2?.education2?.startDate?.month}}
            {{formdata?.education2?.education2?.startDate?.year}} -
            {{formdata?.education2?.education2?.endDate?.month}}
            {{formdata?.education2?.education2?.endDate?.year}}
          </div>
        </div>

        <div class="ats-education" *ngIf="formdata?.education3?.education3">
          <div class="edu-degree">{{formdata?.education3?.education3?.degree}}</div>
          <div class="edu-school">{{formdata?.education3?.education3?.school}}</div>
          <div class="edu-location">{{formdata?.education3?.education3?.city}}</div>
          <div class="edu-date">
            {{formdata?.education3?.education3?.startDate?.month}}
            {{formdata?.education3?.education3?.startDate?.year}} -
            {{formdata?.education3?.education3?.endDate?.month}}
            {{formdata?.education3?.education3?.endDate?.year}}
          </div>
        </div>
      </section>

      <!-- Certifications & Courses -->
      <section class="ats-section" *ngIf="hasCourses()">
        <h2 class="ats-section-title">CERTIFICATIONS AND TRAINING</h2>

        <div class="ats-course" *ngIf="formdata?.courses?.course1">
          <div class="course-name">{{formdata?.courses?.course1?.course}}</div>
          <div class="course-institution">{{formdata?.courses?.course1?.institution}}</div>
          <div class="course-date">
            {{formdata?.courses?.course1?.startDate?.month}}
            {{formdata?.courses?.course1?.startDate?.year}}
          </div>
          <div class="course-description" [innerHTML]="formdata?.courses?.course1?.description"></div>
        </div>

        <div class="ats-course" *ngIf="formdata?.courses2?.courses2">
          <div class="course-name">{{formdata?.courses2?.courses2?.course}}</div>
          <div class="course-institution">{{formdata?.courses2?.courses2?.institution}}</div>
        </div>

        <div class="ats-course" *ngIf="formdata?.courses3?.courses3">
          <div class="course-name">{{formdata?.courses3?.courses3?.course}}</div>
          <div class="course-institution">{{formdata?.courses3?.courses3?.institution}}</div>
        </div>
      </section>

      <!-- Languages -->
      <section class="ats-section" *ngIf="hasLanguages()">
        <h2 class="ats-section-title">LANGUAGES</h2>
        <div class="ats-languages">
          <span class="language-item" *ngIf="formdata?.languages?.language1">
            {{formdata?.languages?.language1?.language}}
            ({{formdata?.languages?.language1?.level}})
          </span>
          <span class="language-item" *ngIf="formdata?.language2?.language2">
            {{formdata?.language2?.language2?.language}}
            ({{formdata?.language2?.language2?.level}})
          </span>
          <span class="language-item" *ngIf="formdata?.language3?.language3">
            {{formdata?.language3?.language3?.language}}
            ({{formdata?.language3?.language3?.level}})
          </span>
        </div>
      </section>

      <!-- Interests -->
      <section class="ats-section" *ngIf="hasInterests()">
        <h2 class="ats-section-title">PROFESSIONAL INTERESTS</h2>
        <div class="ats-interests">
          <span class="interest-item" *ngIf="formdata?.interest?.interest1">
            {{formdata?.interest?.interest1?.interest}}
          </span>
          <span class="interest-item" *ngIf="formdata?.interest2?.interest2">
            {{formdata?.interest2?.interest2?.interest}}
          </span>
          <span class="interest-item" *ngIf="formdata?.interest3?.interest3">
            {{formdata?.interest3?.interest3?.interest}}
          </span>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .ats-resume {
      font-family: 'Calibri', 'Arial', 'Helvetica Neue', Helvetica, sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #111111 !important;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20mm;
      background: #ffffff;
      font-weight: 500;
    }

    .ats-resume * {
      color: #111111 !important;
      opacity: 1 !important;
      text-shadow: none !important;
    }

    /* Header Styles */
    .ats-header {
      text-align: center;
      border-bottom: 2px solid #111111;
      padding-bottom: 12pt;
      margin-bottom: 16pt;
    }

    .ats-name {
      font-size: 20pt;
      font-weight: bold;
      margin: 0 0 8pt 0;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #000000;
    }

    .ats-contact {
      font-size: 10pt;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12pt;
    }

    .contact-item {
      display: inline-flex;
      align-items: center;
      gap: 4pt;
    }

    .contact-item fa-icon {
      font-size: 9pt;
      color: #333;
    }

    /* Section Styles */
    .ats-section {
      margin-bottom: 14pt;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .ats-section-title {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1.5px solid #111111;
      padding-bottom: 3pt;
      margin-bottom: 8pt;
      color: #111111 !important;
    }

    .ats-content {
      text-align: justify;
    }

    /* Experience Styles */
    .ats-experience {
      margin-bottom: 12pt;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .exp-header {
      margin-bottom: 4pt;
    }

    .exp-title {
      font-size: 11pt;
      font-weight: bold;
      margin: 0;
      color: #000000;
    }

    .exp-company {
      font-size: 11pt;
      font-weight: 600;
      font-style: italic;
    }

    .exp-location {
      font-size: 10pt;
      color: #333333;
    }

    .exp-date {
      font-size: 10pt;
      color: #333333;
      margin-top: 2pt;
    }

    .exp-description {
      margin-top: 4pt;
      font-size: 10.5pt;
    }

    .exp-description::ng-deep ul {
      margin: 4pt 0;
      padding-left: 20pt;
    }

    .exp-description::ng-deep li {
      margin-bottom: 2pt;
    }

    /* Education Styles */
    .ats-education {
      margin-bottom: 8pt;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .edu-degree {
      font-weight: bold;
      font-size: 11pt;
    }

    .edu-school {
      font-style: italic;
      font-size: 11pt;
    }

    .edu-location {
      font-size: 10pt;
      color: #333333;
    }

    .edu-date {
      font-size: 10pt;
      color: #333333;
    }

    .edu-description {
      margin-top: 2pt;
      font-size: 10.5pt;
    }

    /* Skills Styles */
    .ats-skills {
      font-size: 10.5pt;
    }

    .skill-category {
      margin-bottom: 4pt;
    }

    /* Course Styles */
    .ats-course {
      margin-bottom: 6pt;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .course-name {
      font-weight: bold;
      font-size: 10.5pt;
    }

    .course-institution {
      font-style: italic;
      font-size: 10pt;
    }

    .course-date {
      font-size: 10pt;
      color: #333333;
    }

    .course-description {
      margin-top: 2pt;
      font-size: 10pt;
    }

    /* Languages & Interests */
    .ats-languages,
    .ats-interests {
      display: flex;
      flex-wrap: wrap;
      gap: 8pt;
    }

    .language-item,
    .interest-item {
      background: none;
      border: none;
      padding: 0;
      font-size: 10.5pt;
    }

    /* Print Optimization */
    @media print {
      .ats-resume {
        padding: 0;
        max-width: none;
      }

      .ats-section {
        page-break-inside: avoid;
      }

      .ats-experience,
      .ats-education,
      .ats-course {
        page-break-inside: avoid;
      }
    }

    /* Screen Preview */
    @media screen {
      .ats-resume {
        box-shadow: 0 0 20px rgba(0,0,0,0.1);
      }
    }
  `]
})
export class AtsFriendlyComponent implements OnInit {
  @Input() formdata: any = {};

  ngOnInit(): void {}

  hasSkills(): boolean {
    return !!(this.formdata?.skills?.skill1 ||
              this.formdata?.skills2?.skills2 ||
              this.formdata?.skills3?.skills3);
  }

  hasExperience(): boolean {
    return !!(this.formdata?.experiance?.experiance1 ||
              this.formdata?.experiance2?.experiance2 ||
              this.formdata?.experiance3?.experiance3);
  }

  hasEducation(): boolean {
    return !!(this.formdata?.education?.education1 ||
              this.formdata?.education2?.education2 ||
              this.formdata?.education3?.education3);
  }

  hasCourses(): boolean {
    return !!(this.formdata?.courses?.course1 ||
              this.formdata?.courses2?.courses2 ||
              this.formdata?.courses3?.courses3);
  }

  hasLanguages(): boolean {
    return !!(this.formdata?.languages?.language1 ||
              this.formdata?.language2?.language2 ||
              this.formdata?.language3?.language3);
  }

  hasInterests(): boolean {
    return !!(this.formdata?.interest?.interest1 ||
              this.formdata?.interest2?.interest2 ||
              this.formdata?.interest3?.interest3);
  }
}
