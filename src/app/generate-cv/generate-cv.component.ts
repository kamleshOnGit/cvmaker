import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewChecked
} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import {FormcommunicationService} from './formcommunication.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {

  faList,
  faUserCircle,
  faUser,
  faArrowDown,
  faArrowUp,
  faCog,
  faChevronRight,
  faChevronLeft,
  faLightbulb,
  faSave,
  faBriefcase,
  faPlusCircle,
  faPalette,
  faCommentAlt,
  faMousePointer,
  faTrash,
  faPen
} from '@fortawesome/free-solid-svg-icons';

@Component({selector: 'app-generate-cv', templateUrl: './generate-cv.component.html', styleUrls: ['./generate-cv.component.scss']})

export class GenerateCvComponent implements OnInit,
AfterViewChecked {
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
  arrowleft = faChevronLeft;
  showpage = true;
  cookieValue;
  // profile;  exp; edu; inter; refs; skilled;

  @ViewChild('formchild', { static: false }) formchild!: ElementRef<any>;

  forlength;
  formdata = {};
  divstructure;
  compareArray = [];
  finalFormdata = {};
  profilePic;
  prfilePicPreview = null;
  isProfilePicSet = false;
  langflag = false;
  courseflag = false;
  profileflag = true;
  experianceflag = true;
  educationflag = true;
  interestflag = true;
  referenceflag = true;
  skillsflag = true;
  settings = false;
  sectiondisplay = false;
  disablebtnChek = false;
  extrasection = ['+ Add extra section', 'Language' , 'Courses'];
  count = 1;
  count1 = 1;
  count2 = 1;
  count3 = 1;
  count4 = 1;
  count5 = 1;
  count6 = 1;

  // Custom validator for date range
  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('startDate');
    const endDate = control.get('endDate');
    
    if (!startDate || !endDate) return null;
    
    const startMonth = startDate.value?.month;
    const startYear = startDate.value?.year;
    const endMonth = endDate.value?.month;
    const endYear = endDate.value?.year;
    
    if (!startMonth || !startYear || !endMonth || !endYear) return null;
    
    const startDateValue = new Date(parseInt(startYear), this.getMonthIndex(startMonth), 1);
    const endDateValue = new Date(parseInt(endYear), this.getMonthIndex(endMonth), 1);
    
    if (startDateValue > endDateValue) {
      return { dateRangeInvalid: true };
    }
    
    return null;
  }

  private getMonthIndex(month: string): number {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months.indexOf(month);
  }

  years: number[] = [];

  generateYears() {
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let year = 2000; year <= currentYear; year++) {
      this.years.push(year);
    }
  }
  base64textString;
  ext;
  cvformdata;

  constructor(private formbuilder: FormBuilder, private cookieService: CookieService,
              private formservices: FormcommunicationService, private render: Renderer2,
              private http: HttpClient, private router: Router) {}

  onshowpage() {
    this.showpage = !this.showpage;
  }

  goToExperience() {
    const personal = this.cvformdata.get('personal') as FormGroup;
    this.markControlsTouched(personal);

    if (personal.valid) {
      this.showpage = false;
    }
  }

  onSubmit() {
    console.log(this.cvformdata.value);
    this.cvformdata.updateValueAndValidity();
    if (this.cvformdata.invalid) {
      this.markControlsTouched(this.cvformdata);
      console.log(this.findInvalidControls(this.cvformdata));
      return;
    }
    this.formdata = this.cvformdata.value;
    this.divstructure = this.formchild.nativeElement.children;
    // this.Onformatdata();
    this.formservices.formdata = this.formdata;
    
    // Always navigate to CV template
    this.router.navigate(['../cvtemplate']);
  }

  loadResumeCheckerData(data: any) {
    if (data.personal) {
      this.cvformdata.patchValue({
        personal: {
          firstName: data.personal.firstName || '',
          secondName: data.personal.secondName || '',
          email: data.personal.email || '',
          phone: data.personal.phone || '',
          city: data.personal.city || '',
          country: data.personal.country || '',
          address: data.personal.city || '',
          postalCode: '',
          linkedin: data.personal.linkedin || ''
        }
      });
    }
    if (data.profile) {
      this.cvformdata.patchValue({
        profile: {
          profiledata: data.profile.text || ''
        }
      });
    }
    if (data.experiance) {
      this.cvformdata.patchValue({
        experiance: {
          experiance1: {
            jobTitle: data.experiance.jobTitle || data.personal?.title || '',
            employer: data.experiance.employer || '',
            city: data.experiance.city || '',
            description: data.experiance.description || ''
          }
        }
      });
    }
    if (data.education) {
      this.cvformdata.patchValue({
        education: {
          education1: {
            degree: data.education.degree || '',
            school: data.education.school || '',
            city: data.education.city || '',
            description: data.education.description || ''
          }
        }
      });
    }
    if (data.skills && data.skills.length > 0) {
      this.cvformdata.patchValue({
        skills: {
          skill1: {
            skill: data.skills[0].skill || ''
          }
        }
      });
    }
  }

  private markControlsTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);

      control.markAsTouched();
      control.markAsDirty();

      if (control instanceof FormGroup) {
        this.markControlsTouched(control);
      }
    });
  }

  private findInvalidControls(formGroup: FormGroup, path = '') {
    let invalidControls = [];

    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      const controlPath = path ? `${path}.${key}` : key;

      if (control instanceof FormGroup) {
        invalidControls = invalidControls.concat(this.findInvalidControls(control, controlPath));
      } else if (control.invalid) {
        invalidControls.push(controlPath);
      }
    });

    return invalidControls;
  }

  // showing profilepic preview and sending data to server
  onFileChange($event) {
    this.profilePic = $event.target.files[0];
    console.log($event, this.profilePic);
    this.isProfilePicSet = true;
    // this.onFileUpload();
    const pic = URL
      .createObjectURL(this.profilePic)
      .split('/');
    const picModified = pic[1] + pic[2] + pic[3];
    this.prfilePicPreview = URL.createObjectURL(this.profilePic);
    this.handleFileSelect($event);
    this.ext = this
      .profilePic
      .name
      .split('.')[1];
    // this.formservices.profilepic = this.prfilePicPreview;
    console.log(this.ext);
  }

  handleFileSelect(evt) {
    const files = evt.target.files;
    const file = files[0];

    if (files && file) {
      const reader = new FileReader();

      reader.onload = this
        ._handleReaderLoaded
        .bind(this);

      reader.readAsBinaryString(file);
    }
  }

  _handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    this.formservices.profilepic = `data:image/${this.ext};charset=utf-8;base64,${this.base64textString} `;
    console.log(this.base64textString);
  }

  onFileUpload() {
    const formdata = new FormData();
    formdata.append('image', this.profilePic, this.profilePic.name);
    this
      .http
      .post('apipath', formdata, {
        reportProgress: true,
        observe: 'events'
      })
      .subscribe(events => console.log());
  }

  // dynamicaly adding section into form
  extraschange(val) {
    switch (val.target.value) {
      case 'Language':
        this.langflag = true;
        this
          .cvformdata
          .addControl('languages', this.formbuilder.group({
            language1: this
              .formbuilder
              .group({
                language: [
                  '', Validators.required
                ],
                level: ['', Validators.required]
              })
          }));
        const langIndex = this.extrasection.indexOf('Language');
        if (langIndex > -1) {
          this.extrasection.splice(langIndex, 1);
        }
        break;
      case 'Courses':
        this.courseflag = true;
        this
          .cvformdata
          .addControl('courses', this.formbuilder.group({
            course1: this
              .formbuilder
              .group({
                course: [
                  '', Validators.required
                ],
                institution: [
                  '', Validators.required
                ],
                startDate: this
                  .formbuilder
                  .group({
                    month: [
                      '', Validators.required
                    ],
                    year: ['', Validators.required]
                  }),
                endDate: this
                  .formbuilder
                  .group({
                    month: [
                      '', Validators.required
                    ],
                    year: ['', Validators.required]
                  }),
                description: ['', Validators.required]
              })
          }));
        const courseIndex = this.extrasection.indexOf('Courses');
        if (courseIndex > -1) {
          this.extrasection.splice(courseIndex, 1);
        }
        break;
      case 'Skills':
        this.skillsflag = true;
        this
          .cvformdata
          .addControl('skills', this.formbuilder.group({
            skill1: this
              .formbuilder
              .group({
                skill: [
                  '', Validators.required
                ],
                level: ['', Validators.required]
              })
          }));
        const skillIndex = this.extrasection.indexOf('Skills');
        if (skillIndex > -1) {
          this.extrasection.splice(skillIndex, 1);
        }
        break;
      case 'Experiance':
        this.experianceflag = true;
        this
          .cvformdata
          .addControl('experiance', this.formbuilder.group({
            experiance1: this
              .formbuilder
              .group({
                jobTitle: [
                  '', Validators.required
                ],
                city: [
                  '', Validators.required
                ],
                employer: [
                  '', Validators.required
                ],
                startDate: this
                  .formbuilder
                  .group({
                    month: [
                      '', Validators.required
                    ],
                    year: ['', Validators.required]
                  }),
                endDate: this
                  .formbuilder
                  .group({
                    month: [
                      '', Validators.required
                    ],
                    year: ['', Validators.required]
                  }),
                description: ['', Validators.required]
              })
          }));
        const expIndex = this.extrasection.indexOf('Experiance');
        if (expIndex > -1) {
          this.extrasection.splice(expIndex, 1);
        }
        break;
      case 'Education':
        this.educationflag = true;
        this
          .cvformdata
          .addControl('education', this.formbuilder.group({
            education1: this
              .formbuilder
              .group({
                degree: [
                  '', Validators.required
                ],
                city: [
                  '', Validators.required
                ],
                school: [
                  '', Validators.required
                ],
                startDate: this
                  .formbuilder
                  .group({
                    month: [
                      '', Validators.required
                    ],
                    year: ['', Validators.required]
                  }),
                endDate: this
                  .formbuilder
                  .group({
                    month: [
                      '', Validators.required
                    ],
                    year: ['', Validators.required]
                  }),
                description: ['', Validators.required]
              })
          }));
        const eduIndex = this.extrasection.indexOf('Education');
        if (eduIndex > -1) {
          this.extrasection.splice(eduIndex, 1);
        }
        break;
      case 'Interest':
        this.interestflag = true;
        this
          .cvformdata
          .addControl('interest', this.formbuilder.group({
            interest1: this
              .formbuilder
              .group({
                interest: ['', Validators.required]
              })
          }));
        const interestIndex = this.extrasection.indexOf('Interest');
        if (interestIndex > -1) {
          this.extrasection.splice(interestIndex, 1);
        }
        break;
      case 'Reference':
        this.referenceflag = true;
        this
          .cvformdata
          .addControl('reference', this.formbuilder.group({
            reference1: this
              .formbuilder
              .group({
                cName: [''],
                cPerson: [''],
                cPhone: [''],
                cEmail: ['', Validators.email]
              })
          }));
        const refIndex = this.extrasection.indexOf('Reference');
        if (refIndex > -1) {
          this.extrasection.splice(refIndex, 1);
        }
        break;
      case 'Profile':
        this.profileflag = true;
        this
          .cvformdata
          .addControl('profile', this.formbuilder.group({
            profiledata: ['Write about yourself', Validators.required]
          }));
        break;
    }
    console.log(val.target.value);
  }
  //  call services methods in compoenet for inline template
  setting(identifier : string) {
    this
      .formservices
      .setting(identifier);
  }

  ngOnInit() {
    // Generate years array for dropdowns
    this.generateYears();
    
    // Check if coming from resume checker
    const resumeCheckerData = localStorage.getItem('resumeCheckerData');
    const returnToChecker = localStorage.getItem('returnToResumeChecker');
    
    // Check if there's saved form data from back navigation
    const savedFormData = localStorage.getItem('savedFormData');
    
    this.cvformdata = this
      .formbuilder
      .group({
        personal: this
          .formbuilder
          .group({
            firstName: [
              '', Validators.required
            ],
            secondName: [
              '', Validators.required
            ],
            email: [
              '',
              [Validators.required, Validators.email]
            ],
            phone: [
              '',
              [
                Validators.required, Validators.pattern(/^[0-9][0-9]{9}$/)
              ]
            ],
            address: [''],
            city: [''],
            country: [''],
            postalCode: [''],
            linkedin: ['']
          }),
        profile: this
          .formbuilder
          .group({
            profiledata: ['Write about yourself', Validators.required]
          }),
        experiance: this
          .formbuilder
          .group({
            experiance1: this
              .formbuilder
              .group({
                jobTitle: [
                  '', Validators.required
                ],
                city: [
                  '', Validators.required
                ],
                employer: [
                  '', Validators.required
                ],
                startDate: this
                  .formbuilder
                  .group({
                    month: [
                      '', Validators.required
                    ],
                    year: ['', Validators.required]
                  }),
                endDate: this
                  .formbuilder
                  .group({
                    month: [
                      '', Validators.required
                    ],
                    year: ['', Validators.required]
                  }),
                description: ['', Validators.required]
              }, { validators: this.dateRangeValidator.bind(this) })
          }),
        education: this
          .formbuilder
          .group({
            education1: this
              .formbuilder
              .group({
                degree: [
                  '', Validators.required
                ],
                city: [
                  '', Validators.required
                ],
                school: [
                  '', Validators.required
                ],
                startDate: this
                  .formbuilder
                  .group({
                    month: [
                      '', Validators.required
                    ],
                    year: ['', Validators.required]
                  }),
                endDate: this
                  .formbuilder
                  .group({
                    month: [
                      '', Validators.required
                    ],
                    year: ['', Validators.required]
                  }),
                description: ['', Validators.required]
              }, { validators: this.dateRangeValidator.bind(this) })
          }),
        interest: this
          .formbuilder
          .group({
            interest1: this
              .formbuilder
              .group({
                interest: ['', Validators.required]
              })
          }),
        reference: this
          .formbuilder
          .group({
            reference1: this
              .formbuilder
              .group({
                cName: [
                  '', Validators.required
                ],
                cPerson: [
                  '', Validators.required
                ],
                cPhone: [
                  '',
                  [
                    Validators.required, Validators.pattern(/^[0-9][0-9]{9}$/)
                  ]
                ],
                cEmail: [
                  '',
                  [Validators.required, Validators.email]
                ]
              })
          }),
        skills: this
          .formbuilder
          .group({
            skill1: this
              .formbuilder
              .group({
                skill: [
                  '', Validators.required
                ],
                level: ['', Validators.required]
              })
          })
      });
    this.formservices.formref = this.cvformdata;
    
    // Load resume checker data if available
    if (resumeCheckerData) {
      try {
        const parsedData = JSON.parse(resumeCheckerData);
        this.loadResumeCheckerData(parsedData);
        localStorage.removeItem('resumeCheckerData');
      } catch (e) {
        console.error('Error parsing resume checker data:', e);
      }
    }
    
    // Load saved form data if available (from back navigation)
    if (savedFormData && !resumeCheckerData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        this.cvformdata.patchValue(parsedData);
        localStorage.removeItem('savedFormData');
      } catch (e) {
        console.error('Error parsing saved form data:', e);
      }
    }
    
    // start adding extra form control
    this
      .formservices
      .coursefieldsublect
      .subscribe(val => this.addextracourse());
    this
      .formservices
      .count6
      .subscribe(count => this.count6 = count);
    this
      .formservices
      .languagefieldsublect
      .subscribe(val => this.addextralanguage());
    this
      .formservices
      .count
      .subscribe(count => this.count = count);
    this
      .formservices
      .skillfieldsublect
      .subscribe(val => this.addextraskill());
    this
      .formservices
      .count5
      .subscribe(count => this.count5 = count);
    this
      .formservices
      .experiancefieldsublect
      .subscribe(val => this.addextraexperiance());
    this
      .formservices
      .count1
      .subscribe(count => this.count1 = count);
    this
      .formservices
      .educationfieldsublect
      .subscribe(val => this.addextraeducation());
    this
      .formservices
      .count2
      .subscribe(count => this.count2 = count);
    this
      .formservices
      .referencefieldsublect
      .subscribe(val => this.addextrareference());
    this
      .formservices
      .count4
      .subscribe(count => this.count4 = count);
    this
      .formservices
      .interestfieldsublect
      .subscribe(val => this.addextrainterest());
    this
      .formservices
      .count3
      .subscribe(count => this.count3 = count);
    // add extra form controll ends to remove extra form control
    this
      .formservices
      .newcontrolremoved
      .subscribe(val => {
        if (val.startsWith('experiance')) {
          this.cvformdata.get('experiance').removeControl(val);
        } else if (val.startsWith('education')) {
          this.cvformdata.get('education').removeControl(val);
        } else if (val.startsWith('skills')) {
          this.cvformdata.get('skills').removeControl(val);
        } else if (val.startsWith('reference')) {
          this.cvformdata.get('reference').removeControl(val);
        } else if (val.startsWith('interest')) {
          this.cvformdata.get('interest').removeControl(val);
        } else if (val.startsWith('language')) {
          this.cvformdata.get('languages').removeControl(val);
        } else if (val.startsWith('course')) {
          this.cvformdata.get('courses').removeControl(val);
        } else {
          this.cvformdata.removeControl(val);
        }
        console.log(val);
      });

    if (localStorage.getItem('profilepic') != undefined || localStorage.getItem('profilepic') != null) {
      this.prfilePicPreview = localStorage.getItem('profilepic');
      this.isProfilePicSet = true;
      console.log(this.prfilePicPreview);
    }

    if (this.cookieService.get('prefillformdata')) {
      this.cookieValue = JSON.parse(this.cookieService.get('prefillformdata'));
      console.log(this.cookieValue , typeof (this.cookieValue.languages) ===  'object');
      const cookie = this.cookieValue;

      if ( typeof (cookie.languages) ===  'object') {
        this.langflag = true;
        this
          .cvformdata
          .addControl('languages', this.formbuilder.group({
            language1: this
              .formbuilder
              .group({
                language: [
                  '', Validators.required
                ],
                level: ['', Validators.required]
              })
          }));
      }
      if (typeof (cookie.language2) ===  'object') {
        this.addextralanguage();
        this.formservices.language2 = 'language2';
      }
      if (typeof (cookie.language3) ===  'object') {
        this.addextralanguage();
        this.formservices.language3 = 'language3';
      }
      if ( typeof (cookie.courses) ===  'object') {
        this.courseflag = true;
        this
          .cvformdata
          .addControl('courses', this.formbuilder.group({
            course1: this
              .formbuilder
              .group({
                course: [
                  '', Validators.required
                ],
                institution: [
                  '', Validators.required
                ],
                startDate: this
                  .formbuilder
                  .group({
                    month: [
                      '', Validators.required
                    ],
                    year: ['', Validators.required]
                  }),
                endDate: this
                  .formbuilder
                  .group({
                    month: [
                      '', Validators.required
                    ],
                    year: ['', Validators.required]
                  }),
                description: ['', Validators.required]
              })
          }));
      }
      if (typeof (cookie.courses2) ===  'object') {
        this.addextracourse();
        this.formservices.course2 = 'course2';
      }
      if ( typeof (cookie.courses3) ===  'object') {
        this.addextracourse();
        this.formservices.course3 = 'course3';
      }
      if ( typeof (cookie.skills2) ===  'object') {
        this.addextraskill();
        this.formservices.skill2 = 'skill2';
      }
      if ( typeof (cookie.skills3) ===  'object') {
        this.addextraskill();
        this.formservices.skill3 = 'skill3';
      }
      if ( typeof (cookie.experiance2) ===  'object') {
        this.addextraexperiance();
        this.formservices.experiance2 = 'experiance2';
      }
      if ( typeof (cookie.experiance3) ===  'object') {
        this.addextraexperiance();
        this.formservices.experiance3 = 'experiance3';
      }

      if ( typeof (cookie.education2) ===  'object') {
        this.addextraeducation();
        this.formservices.education2 = 'education2';
      }
      if ( typeof (cookie.education3) ===  'object') {
        this.addextraeducation();
        this.formservices.education3 = 'education3';
      }

      if ( typeof (cookie.interest2) ===  'object') {
        this.addextrainterest();
        this.formservices.interest2 = 'interest2';
      }

      if ( typeof (cookie.interest3) ===  'object') {
        this.addextrainterest();
        this.formservices.interest3 = 'interest3';
      }

      if ( typeof (cookie.reference2) ===  'object') {
        this.addextrareference();
        this.formservices.reference2 = 'reference2';
      }
      if ( typeof (cookie.reference3) ===  'object') {
        this.addextrareference();
        this.formservices.reference3 = 'reference3';
      }

      this
        .cvformdata
        .patchValue(cookie);
      // this.cookieService.deleteAll();

    }

  }
  ngAfterViewChecked() {
    this.formservices.forlength = this.formchild.nativeElement.children;
    this.formservices.formchild = this.formchild.nativeElement;
    this.formservices.render = this.render;
    this.settings = this.formservices.settings;

    this
      .formservices
      .changeview
      .subscribe(val => {
        const name = val.name;
        const flag = val.flag;
        console.log(val);
        switch (name) {
          case 'languages':
            this.langflag = false;
            if (this.extrasection.indexOf('Language') === -1) {
              this
                .extrasection
                .push('Language');
            }
            if (this.cvformdata.contains('languages')) {
              this
                .cvformdata
                .removeControl('languages');
            }

            break;
          case 'profile':
            this.profileflag = false;
            if (this.extrasection.indexOf('Profile') === -1) {
              this
                .extrasection
                .push('Profile');
            }
            if (this.cvformdata.contains('profile')) {
              this
                .cvformdata
                .removeControl('profile');
            }
            break;
          case 'experiance':
            this.experianceflag = false;
            if (this.extrasection.indexOf('Experiance') === -1) {
              this
                .extrasection
                .push('Experiance');
            }
            if (this.cvformdata.contains('experiance')) {
              this
                .cvformdata
                .removeControl('experiance');
            }
            break;
          case 'education':
            this.educationflag = false;
            if (this.extrasection.indexOf('Education') === -1) {
              this
                .extrasection
                .push('Education');
            }
            if (this.cvformdata.contains('education')) {
              this
                .cvformdata
                .removeControl('education');
            }
            break;
          case 'interest':
            this.interestflag = false;
            if (this.extrasection.indexOf('Interest') === -1) {
              this
                .extrasection
                .push('Interest');
            }
            if (this.cvformdata.contains('interest')) {
              this
                .cvformdata
                .removeControl('interest');
            }
            break;
          case 'skills':
            this.skillsflag = false;
            if (this.extrasection.indexOf('Skills') === -1) {
              this
                .extrasection
                .push('Skills');
            }
            if (this.cvformdata.contains('skills')) {
              this
                .cvformdata
                .removeControl('skills');
            }
            break;
          case 'courses':
            this.courseflag = false;
            if (this.extrasection.indexOf('Courses') === -1) {
              this
                .extrasection
                .push('Courses');
            }
            if (this.cvformdata.contains('courses')) {
              this
                .cvformdata
                .removeControl('courses');
            }
            break;
          case 'reference':
            this.referenceflag = false;
            if (this.extrasection.indexOf('Reference') === -1) {
              this
                .extrasection
                .push('Reference');
            }
            if (this.cvformdata.contains('reference')) {
              this
                .cvformdata
                .removeControl('reference');
            }
            break;
        }
      });
  }

  throwVal(event) {
    console.log(event);
    if (event.target.classList.contains('checkbox')) {
      this.sectiondisplay = event.target.checked;
      this
        .formservices
        .hidesection();
      this.disablebtnChek = true;
    }
    if (event.target.classList.contains('settings')) {
      this
        .formservices
        .showpopup();
      this.disablebtnChek = false;
    }

    console.log(event);
  }

  removeSection() {
    const identifier = this.formservices.identifier;
    this.formservices.hidesection();
    this.formservices.settings = false;
    this.settings = false;
  }

  addextralanguage() {
    this.count = this.cvformdata.get('language2') ? (this.cvformdata.get('language3') ? 4 : 3) : 2;
    if (this.count === 2) {
      const language = 'language' + this.count;
      this
        .cvformdata
        .addControl(language, this.formbuilder.group({
          language2: this
            .formbuilder
            .group({
              language: [
                '', Validators.required
              ],
              level: ['', Validators.required]
            })
        }));
      this
        .formservices
        .newcontroladded
        .next(this.cvformdata.get(language));
    }
    if (this.count === 3) {
      const language = 'language' + this.count;
      this
        .cvformdata
        .addControl(language, this.formbuilder.group({
          language3: this
            .formbuilder
            .group({
              language: [
                '', Validators.required
              ],
              level: ['', Validators.required]
            })
        }));
      this
        .formservices
        .newcontroladded
        .next(this.cvformdata.get(language));
    }
  }

  addextracourse() {
    this.count6 = this.cvformdata.get('courses2') ? (this.cvformdata.get('courses3') ? 4 : 3) : 2;
    if (this.count6 === 2) {
      const courses = 'courses' + this.count6;
      this
        .cvformdata
        .addControl(courses, this.formbuilder.group({
          courses2: this
            .formbuilder
            .group({
              course: [
                '', Validators.required
              ],
              institution: [
                '', Validators.required
              ],
              startDate: this
                .formbuilder
                .group({
                  month: [
                    '', Validators.required
                  ],
                  year: ['', Validators.required]
                }),
              endDate: this
                .formbuilder
                .group({
                  month: [
                    '', Validators.required
                  ],
                  year: ['', Validators.required]
                }),
              description: ['', Validators.required]
            })
        }));
      this
        .formservices
        .newcontroladded
        .next(this.cvformdata.get(courses));
    }
    if (this.count6 === 3) {
      const courses = 'courses' + this.count6;
      this
        .cvformdata
        .addControl(courses, this.formbuilder.group({
          courses3: this
            .formbuilder
            .group({
              course: [
                '', Validators.required
              ],
              institution: [
                '', Validators.required
              ],
              startDate: this
                .formbuilder
                .group({
                  month: [
                    '', Validators.required
                  ],
                  year: ['', Validators.required]
                }),
              endDate: this
                .formbuilder
                .group({
                  month: [
                    '', Validators.required
                  ],
                  year: ['', Validators.required]
                }),
              description: ['', Validators.required]
            })
        }));
      this
        .formservices
        .newcontroladded
        .next(this.cvformdata.get(courses));
    }
  }

  addextraskill() {
    let next = 2;
    while (this.cvformdata.get('skills')?.get('skills' + next)) { next++; }
    const skills = 'skills' + next;
    this.cvformdata.get('skills').addControl(skills, this.formbuilder.group({
      skill: [''],
      level: ['']
    }));
    this.formservices.newcontroladded.next(this.cvformdata.get('skills'));
  }

  addextraexperiance() {
    let next = 2;
    while (this.cvformdata.get('experiance')?.get('experiance' + next)) { next++; }
    if (next > 10) { return; }
    const experiance = 'experiance' + next;
    this.cvformdata.get('experiance').addControl(experiance, this.formbuilder.group({
      jobTitle: [''],
      city: [''],
      employer: [''],
      startDate: this.formbuilder.group({ month: [''], year: [''] }),
      endDate: this.formbuilder.group({ month: [''], year: [''] }),
      description: ['']
    }));
    this.formservices.newcontroladded.next(this.cvformdata.get('experiance'));
  }

  addextraeducation() {
    let next = 2;
    while (this.cvformdata.get('education')?.get('education' + next)) { next++; }
    if (next > 5) { return; }
    const education = 'education' + next;
    this.cvformdata.get('education').addControl(education, this.formbuilder.group({
      degree: [''],
      city: [''],
      school: [''],
      startDate: this.formbuilder.group({ month: [''], year: [''] }),
      endDate: this.formbuilder.group({ month: [''], year: [''] }),
      description: ['']
    }));
    this.formservices.newcontroladded.next(this.cvformdata.get('education'));
  }

  addextrainterest() {
    let next = 2;
    while (this.cvformdata.get('interest')?.get('interest' + next)) { next++; }
    if (next > 5) { return; }
    const interest = 'interest' + next;
    this.cvformdata.get('interest').addControl(interest, this.formbuilder.group({
      interest: ['']
    }));
    this.formservices.newcontroladded.next(this.cvformdata.get('interest'));
  }

  addextrareference() {
    let next = 2;
    while (this.cvformdata.get('reference')?.get('reference' + next)) { next++; }
    if (next > 5) { return; }
    const reference = 'reference' + next;
    this.cvformdata.get('reference').addControl(reference, this.formbuilder.group({
      cName: [''],
      cPerson: [''],
      cPhone: [''],
      cEmail: ['']
    }));
    this.formservices.newcontroladded.next(this.cvformdata.get('reference'));
  }

}
