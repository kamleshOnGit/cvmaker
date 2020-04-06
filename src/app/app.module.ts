import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule , Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SafePipe} from './generate-cv/DomSanitizer';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { TemplatesComponent } from './templates/templates.component';
import { UserloginComponent } from './userlogin/userlogin.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HeaderComponent } from './header/header.component';
import { GenerateCvComponent } from './generate-cv/generate-cv.component';
import { CvFeaturesComponent } from './cv-features/cv-features.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { FaqComponent } from './faq/faq.component';
import { DifferenceComponent } from './difference/difference.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { TemplatePopupComponent } from './template-popup/template-popup.component';
import { QuillModule } from 'ngx-quill';
import { ProfileComponent } from './generate-cv/profile/profile.component';
import { ExperianceComponent } from './generate-cv/experiance/experiance.component';
import { InterestComponent } from './generate-cv/interest/interest.component';
import { ReferanceComponent } from './generate-cv/referance/referance.component';
import { SkillsComponent } from './generate-cv/skills/skills.component';
import { EducationComponent } from './generate-cv/education/education.component';
import { CourseComponent } from './generate-cv/course/course.component';
import { LanguageComponent } from './generate-cv/language/language.component';
import { CvtemplateComponent } from './cvtemplate/cvtemplate.component';
import { AucklandComponent } from './cvtemplate/auckland/auckland.component';
import { BerkeleyComponent } from './cvtemplate/berkeley/berkeley.component';
import { CambridgeComponent } from './cvtemplate/cambridge/cambridge.component';
import { EdinburgComponent } from './cvtemplate/edinburg/edinburg.component';
import { HarvardComponent } from './cvtemplate/harvard/harvard.component';
import { OtagoComponent } from './cvtemplate/otago/otago.component';
import { OxfordComponent } from './cvtemplate/oxford/oxford.component';
import { PrincetonComponent } from './cvtemplate/princeton/princeton.component';
import { StandfordComponent } from './cvtemplate/standford/standford.component';
import { CookieService } from 'ngx-cookie-service';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'templates' , component: TemplatesComponent} ,
  {path: 'cvtemplate' , component: CvtemplateComponent },
  {path: 'genrateCv' , component: GenerateCvComponent },
  {path: 'userLogin' , component: UserloginComponent ,
   children : [
     {path: 'login' , component: LoginComponent },
     {path: 'signup' , component: SignupComponent }
   ]},
   {path: '**' , redirectTo: 'HomeComponent' , pathMatch: 'full'}

];

@NgModule({
  declarations: [
    SafePipe,
    AppComponent,
    NavigationComponent,
    TemplatesComponent,
    UserloginComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    GenerateCvComponent,
    CvFeaturesComponent,
    TestimonialsComponent,
    FaqComponent,
    DifferenceComponent,
    FooterComponent,
    HomeComponent,
    TemplatePopupComponent,
    ProfileComponent,
    ExperianceComponent,
    InterestComponent,
    ReferanceComponent,
    SkillsComponent,
    EducationComponent,
    CourseComponent,
    LanguageComponent,
    CvtemplateComponent,
    AucklandComponent,
    BerkeleyComponent,
    CambridgeComponent,
    EdinburgComponent,
    HarvardComponent,
    OtagoComponent,
    OxfordComponent,
    PrincetonComponent,
    StandfordComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // RouterModule.forRoot(appRoutes),
    RouterModule.forChild(appRoutes),
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    QuillModule.forRoot({
      modules: {
        syntax: false,
        toolbar: [['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        // ['blockquote', 'code-block'],
        // [{ header: 1 }, { header: 2 }],               // custom button values
        [{ list: 'ordered'}, { list: 'bullet' }],
        // [{ script: 'sub'}, { script: 'super' }],      // superscript/subscript
        // [{ indent: '-1'}, { indent: '+1' }],          // outdent/indent
        // [{ direction: 'rtl' }],                         // text direction
        // [{ size: ['small', false, 'large', 'huge'] }],  // custom dropdown
        // [{ header: [1, 2, 3, 4, 5, 6, false] }],
        // [{ color: [] }, { background: [] }],          // dropdown with defaults from theme
        // [{ font: [] }],
        [{ align: [] }]],
       } , format: 'html'  }),

      ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
