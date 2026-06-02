import { Component, OnInit , AfterViewChecked, ViewChild , ElementRef , ViewEncapsulation} from '@angular/core';
import { FormcommunicationService } from '../generate-cv/formcommunication.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
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
  isDownloading = false;
  downloadError = '';

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
    if (!this.printcv || !this.printcv.nativeElement || this.isDownloading) {
      return;
    }

    this.isDownloading = true;
    this.downloadError = '';
    const sourceElement = this.printcv.nativeElement;

    // High quality settings for PDF generation
    html2canvas(sourceElement, {
      scale: 3, // Higher scale for better resolution (300 DPI equivalent)
      useCORS: true,
      allowTaint: true,
      scrollY: -window.scrollY,
      windowWidth: sourceElement.scrollWidth,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 0, // Wait for all images to load
      removeContainer: true
    }).then((canvas) => {
      const doc = new jspdf('p', 'mm' , 'A4');
      const pageWidth = this.getPdfPageWidth(doc);
      const pageHeight = this.getPdfPageHeight(doc);
      const margin = 10;
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = pageHeight - (margin * 2);

      // Calculate dimensions maintaining aspect ratio
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const scaleFactor = contentWidth / canvasWidth;
      const scaledHeight = canvasHeight * scaleFactor;

      // Use PNG for lossless quality (better for text)
      const imageData = canvas.toDataURL('image/png');

      let remainingHeight = scaledHeight;
      let position = margin;

      // Add first page
      doc.addImage(imageData, 'PNG', margin, position, contentWidth, scaledHeight);
      remainingHeight -= contentHeight;

      // Add additional pages if content overflows
      while (remainingHeight > 0) {
        position -= contentHeight;
        doc.addPage();
        doc.addImage(imageData, 'PNG', margin, position, contentWidth, scaledHeight);
        remainingHeight -= contentHeight;
      }

      doc.save('resume.pdf');
      this.isDownloading = false;
    }).catch((error) => {
      console.error('Unable to generate CV PDF', error);
      this.downloadError = 'Unable to generate PDF. Please try again or check the browser console.';
      this.isDownloading = false;
    });

  }

  private getPdfPageWidth(doc) {
    return doc.internal.pageSize.getWidth
      ? doc.internal.pageSize.getWidth()
      : doc.internal.pageSize.width;
  }

  private getPdfPageHeight(doc) {
    return doc.internal.pageSize.getHeight
      ? doc.internal.pageSize.getHeight()
      : doc.internal.pageSize.height;
  }

  editData() {
  const cookie = JSON.stringify(this.formdata);
  // const profilepic = JSON.stringify(this.profilepic);
  this.cookieService.set('prefillformdata' , cookie );
  localStorage.setItem('profilepic' , this.profilepic);
  this.router.navigate(['../genrateCv']);
  }


}
