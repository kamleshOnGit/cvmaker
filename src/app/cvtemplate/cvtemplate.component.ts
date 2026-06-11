import { Component, OnInit , AfterViewChecked, ViewChild , ElementRef , ViewEncapsulation, ChangeDetectorRef} from '@angular/core';
import { FormcommunicationService } from '../generate-cv/formcommunication.service';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ATSAnalyzerService, ATSAnalysisResult } from '../services/ats-analyzer.service';
import { PdfGeneratorService, PDFOptions } from '../services/pdf-generator.service';
import { faArrowLeft, faChartLine, faCheck, faDownload, faEdit, faLightbulb, faRobot } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-cvtemplate',
  templateUrl: './cvtemplate.component.html',
  styleUrls: ['./cvtemplate.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CvtemplateComponent implements OnInit , AfterViewChecked {

  constructor(
    private formservices: FormcommunicationService,
    private router: Router,
    private cookieService: CookieService,
    private atsAnalyzer: ATSAnalyzerService,
    private pdfGenerator: PdfGeneratorService,
    private cdr: ChangeDetectorRef
  ) { }

  profilepic;
  formdata = {};
  popup = 'auckland';
  togglepopup = false;
  isDownloading = false;
  downloadError = '';
  atsAnalysis: ATSAnalysisResult | null = null;
  showATSAnalyzer = false;
  isAnalyzing = false;
  isTemplateLoading = false;
  download = faDownload;
  robot = faRobot;
  chartLine = faChartLine;
  edit = faEdit;
  arrowLeft = faArrowLeft;
  lightbulb = faLightbulb;
  check = faCheck;

  // PDF Options for customizable output
  pdfOptions: PDFOptions = {
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15,
    pageBreakAvoidSelector: '.avoid-break, h5, .media, .job, .degree',
    scale: 2.5,
    quality: 0.95,
    format: 'a4'
  };

  @ViewChild('printcv', { static: false }) printcv!: ElementRef;



  ngOnInit() {
    this.profilepic = this.formservices.profilepic;
    this.formdata = this.formservices.formdata;

    // Run ATS analysis if form data exists
    if (this.formdata && Object.keys(this.formdata).length > 0) {
      this.runATSAnalysis();
    }
  }
  ngAfterViewChecked() {
    console.log(this.formdata , this.profilepic );
  }

  showpopup(identifier: string) {
    this.isTemplateLoading = true;
    this.togglepopup = true;
    this.popup = identifier;
    this.cdr.detectChanges();

    // Simulate template loading and then run ATS analysis
    setTimeout(() => {
      try {
        this.isTemplateLoading = false;
        this.cdr.detectChanges();
        // Auto-run ATS analysis when template opens
        if (!this.atsAnalysis) {
          this.runATSAnalysis();
        }
      } catch (error) {
        console.error('Error loading template:', error);
        this.isTemplateLoading = false;
        this.cdr.detectChanges();
      }
    }, 500);

    console.log(this.togglepopup, identifier , this.printcv);
  }
  toggleOptions() {
    this.togglepopup = false;
  }
  closepopup() {
    this.togglepopup = false;
  }

  async makePdf(useATSFriendly = false) {
    if (!this.printcv || !this.printcv.nativeElement || this.isDownloading) {
      return;
    }

    this.isDownloading = true;
    this.downloadError = '';
    const sourceElement = this.printcv.nativeElement;

    // Add class for PDF contrast enhancement
    sourceElement.classList.add('pdf-generation');

    try {
      let result;

      if (useATSFriendly) {
        // Use ATS-friendly PDF generation with optimized settings
        result = await this.pdfGenerator.generateATSFriendlyPDF(
          sourceElement,
          this.formdata,
          'resume-ats-friendly.pdf'
        );
      } else {
        // Use standard PDF generation with customizable options
        result = await this.pdfGenerator.generatePDF(
          sourceElement,
          'resume.pdf',
          this.pdfOptions
        );
      }

      if (!result.success) {
        this.downloadError = result.error || 'Failed to generate PDF';
      }
    } catch (error) {
      console.error('Unable to generate CV PDF', error);
      this.downloadError = 'Unable to generate PDF. Please try again or check the browser console.';
    } finally {
      // Remove class after PDF generation
      sourceElement.classList.remove('pdf-generation');
      this.isDownloading = false;
    }
  }

  // Generate ATS-friendly PDF
  async makeATSFriendlyPdf() {
    await this.makePdf(true);
  }

  // Run ATS analysis
  async runATSAnalysis() {
    if (!this.formdata || Object.keys(this.formdata).length === 0) {
      return;
    }

    this.isAnalyzing = true;

    try {
      // Small delay to not block UI
      await new Promise(resolve => setTimeout(resolve, 100));

      this.atsAnalysis = this.atsAnalyzer.analyzeResume(this.formdata);
    } catch (error) {
      console.error('Error running ATS analysis:', error);
      this.atsAnalysis = null;
    } finally {
      this.isAnalyzing = false;
      this.cdr.detectChanges();
    }
  }

  // Toggle ATS analyzer visibility
  toggleATSAnalyzer() {
    this.showATSAnalyzer = !this.showATSAnalyzer;
    if (this.showATSAnalyzer && !this.atsAnalysis) {
      this.runATSAnalysis();
    }
  }

  // Refresh ATS analysis
  refreshATSAnalysis() {
    this.runATSAnalysis();
  }

  // Select ATS-friendly template
  selectATSFriendlyTemplate() {
    this.isTemplateLoading = true;
    this.popup = 'ats-friendly';
    this.togglepopup = true;
    this.cdr.detectChanges();

    // Simulate template loading and then run ATS analysis
    setTimeout(() => {
      try {
        this.isTemplateLoading = false;
        this.cdr.detectChanges();
        // Auto-run ATS analysis when template opens
        if (!this.atsAnalysis) {
          this.runATSAnalysis();
        }
      } catch (error) {
        console.error('Error loading ATS template:', error);
        this.isTemplateLoading = false;
        this.cdr.detectChanges();
      }
    }, 500);
  }

  // Check if content fits on one page
  async checkPageOverflow(): Promise<{ pages: number; willOverflow: boolean }> {
    if (!this.printcv || !this.printcv.nativeElement) {
      return { pages: 1, willOverflow: false };
    }

    return await this.pdfGenerator.estimatePages(
      this.printcv.nativeElement,
      this.pdfOptions
    );
  }

  editData() {
  const cookie = JSON.stringify(this.formdata);
  // const profilepic = JSON.stringify(this.profilepic);
  this.cookieService.set('prefillformdata' , cookie );
  localStorage.setItem('profilepic' , this.profilepic);
  this.router.navigate(['../genrateCv']);
  }


}
