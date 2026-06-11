import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFOptions {
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  pageBreakAvoidSelector: string;
  scale: number;
  quality: number;
  format: 'a4' | 'letter';
}

export interface PDFPageInfo {
  pageNumber: number;
  totalPages: number;
  hasOverflow: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {
  private readonly defaultOptions: PDFOptions = {
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15,
    pageBreakAvoidSelector: '.avoid-break, h5, .media, .job, .degree',
    scale: 5,
    quality: 1.0,
    format: 'a4'
  };

  private readonly a4Dimensions = { width: 210, height: 297 }; // mm
  private readonly letterDimensions = { width: 216, height: 279 }; // mm

  async generatePDF(
    element: HTMLElement,
    filename: string = 'resume.pdf',
    customOptions?: Partial<PDFOptions>
  ): Promise<{ success: boolean; error?: string; pages?: number }> {
    const options = { ...this.defaultOptions, ...customOptions };

    try {
      // Apply PDF-specific styles before capture
      const styleBackup = this.applyPDFStyles(element, options);

      // Capture with high quality settings
      const canvas = await html2canvas(element, {
        scale: options.scale,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          this.prepareClonedElement(clonedDoc.body.querySelector('[id]') as HTMLElement, options);
        }
      });

      // Restore original styles
      this.restoreStyles(element, styleBackup);

      // Create PDF with proper dimensions
      const doc = this.createPDFDocument(options);
      const pageDims = this.getPageDimensions(doc);

      // Calculate content area
      const contentWidth = pageDims.width - options.marginLeft - options.marginRight;
      const contentHeight = pageDims.height - options.marginTop - options.marginBottom;

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png', options.quality);

      // Calculate scaled dimensions
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const scaleFactor = (contentWidth * options.scale) / pageDims.width;
      const scaledWidth = contentWidth;
      const scaledHeight = (canvasHeight * contentWidth) / canvasWidth;

      // Calculate pages needed with proper pagination
      const pages = this.calculatePagination(
        scaledHeight,
        contentHeight,
        pageDims.height,
        options.marginTop
      );

      // Add pages with smart content positioning
      for (let i = 0; i < pages.length; i++) {
        if (i > 0) {
          doc.addPage();
        }

        const page = pages[i];
        doc.addImage(
          imgData,
          'PNG',
          options.marginLeft,
          options.marginTop - page.contentOffset,
          scaledWidth,
          scaledHeight
        );

        // Add page numbers if multi-page
        if (pages.length > 1) {
          this.addPageNumber(doc, i + 1, pages.length, pageDims, options);
        }
      }

      // Save PDF
      doc.save(filename);

      return { success: true, pages: pages.length };
    } catch (error) {
      console.error('PDF generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during PDF generation'
      };
    }
  }

  private createPDFDocument(options: PDFOptions): jsPDF {
    const unit = 'mm';
    const format = options.format.toUpperCase() as 'a4' | 'letter';

    return new jsPDF({
      orientation: 'portrait',
      unit,
      format,
      compress: true,
      precision: 16
    });
  }

  private getPageDimensions(doc: jsPDF): { width: number; height: number } {
    const width = doc.internal.pageSize.getWidth
      ? doc.internal.pageSize.getWidth()
      : (doc.internal.pageSize as any).width;
    const height = doc.internal.pageSize.getHeight
      ? doc.internal.pageSize.getHeight()
      : (doc.internal.pageSize as any).height;

    return { width, height };
  }

  private calculatePagination(
    contentHeight: number,
    contentAreaHeight: number,
    pageHeight: number,
    marginTop: number
  ): Array<{ contentOffset: number }> {
    const pages: Array<{ contentOffset: number }> = [];
    let currentOffset = 0;

    while (currentOffset < contentHeight) {
      pages.push({ contentOffset: currentOffset });
      currentOffset += contentAreaHeight;
    }

    // Handle case where content fits on one page
    if (pages.length === 0) {
      pages.push({ contentOffset: 0 });
    }

    return pages;
  }

  private addPageNumber(
    doc: jsPDF,
    currentPage: number,
    totalPages: number,
    pageDims: { width: number; height: number },
    options: PDFOptions
  ): void {
    const text = `Page ${currentPage} of ${totalPages}`;
    const fontSize = 8;
    doc.setFontSize(fontSize);
    doc.setTextColor(128, 128, 128);

    const textWidth = doc.getTextWidth(text);
    const x = (pageDims.width - textWidth) / 2;
    const y = pageDims.height - options.marginBottom / 2;

    doc.text(text, x, y);
  }

  private applyPDFStyles(element: HTMLElement, options: PDFOptions): string {
    const originalStyle = element.getAttribute('style') || '';

    // Apply styles that help with PDF generation - preserve colors instead of forcing black
    const pdfStyles = `
      background-color: white !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    `;

    element.setAttribute('style', originalStyle + pdfStyles);

    // Add page-break-avoid to elements that shouldn't split
    const avoidElements = element.querySelectorAll(options.pageBreakAvoidSelector);
    avoidElements.forEach(el => {
      (el as HTMLElement).style.pageBreakInside = 'avoid';
      (el as HTMLElement).style.breakInside = 'avoid';
    });

    return originalStyle;
  }

  private restoreStyles(element: HTMLElement, originalStyle: string): void {
    if (originalStyle) {
      element.setAttribute('style', originalStyle);
    } else {
      element.removeAttribute('style');
    }
  }

  private prepareClonedElement(element: HTMLElement | null, options: PDFOptions): void {
    if (!element) return;

    // Ensure all backgrounds and colors are preserved with enhanced contrast
    const allElements = element.querySelectorAll('*');
    allElements.forEach(el => {
      const htmlEl = el as HTMLElement;
      (htmlEl.style as any)['webkitPrintColorAdjust'] = 'exact';
      htmlEl.style.printColorAdjust = 'exact';
      
      // Enhance text contrast by ensuring darker colors
      const computedColor = window.getComputedStyle(htmlEl).color;
      if (computedColor && computedColor !== 'rgb(0, 0, 0)' && computedColor !== '#000000') {
        // If text is not black, darken it slightly for better contrast
        htmlEl.style.color = computedColor;
      }
    });

    // Ensure the root element has white background for proper contrast
    if (element) {
      element.style.backgroundColor = '#ffffff';
    }

    // Add margin container for visual separation
    element.style.padding = `${options.marginTop}mm ${options.marginRight}mm ${options.marginBottom}mm ${options.marginLeft}mm`;
    element.style.boxSizing = 'border-box';
  }

  // Generate ATS-friendly single-column PDF
  async generateATSFriendlyPDF(
    element: HTMLElement,
    formData: any,
    filename: string = 'resume-ats.pdf'
  ): Promise<{ success: boolean; error?: string; pages?: number }> {
    const atsOptions: Partial<PDFOptions> = {
      marginTop: 20,
      marginBottom: 20,
      marginLeft: 20,
      marginRight: 20,
      scale: 3, // Higher scale for better text clarity
      quality: 1
    };

    return this.generatePDF(element, filename, atsOptions);
  }

  // Check if content will fit on one page
  async estimatePages(
    element: HTMLElement,
    options?: Partial<PDFOptions>
  ): Promise<{ pages: number; willOverflow: boolean }> {
    const mergedOptions = { ...this.defaultOptions, ...options };

    const canvas = await html2canvas(element, {
      scale: 1,
      useCORS: true,
      logging: false
    });

    const dims = this.a4Dimensions;
    const contentHeight = (canvas.height * dims.width) / canvas.width;
    const availableHeight = dims.height - mergedOptions.marginTop - mergedOptions.marginBottom;

    const pages = Math.ceil(contentHeight / availableHeight);

    return {
      pages,
      willOverflow: pages > 1
    };
  }
}
