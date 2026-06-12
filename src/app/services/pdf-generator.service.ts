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
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
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
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById(element.id) || clonedDoc.getElementById('printcv');
          this.prepareClonedElement(clonedElement as HTMLElement, options);
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
      let scaledWidth = contentWidth;
      let scaledHeight = (canvasHeight * contentWidth) / canvasWidth;

      if (scaledHeight > contentHeight && scaledHeight <= contentHeight * 1.25) {
        const fitRatio = contentHeight / scaledHeight;
        scaledHeight = contentHeight;
        scaledWidth = scaledWidth * fitRatio;
      }

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
        const imageX = options.marginLeft + (contentWidth - scaledWidth) / 2;

        doc.addImage(
          imgData,
          'PNG',
          imageX,
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

    // Apply styles that help with PDF generation
    const pdfStyles = `
      background-color: white !important;
      color: #000000 !important;
      opacity: 1 !important;
      filter: none !important;
      animation: none !important;
      transform: none !important;
      height: auto !important;
      max-height: none !important;
      overflow: visible !important;
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

    // Force full opacity and dark readable colors before html2canvas capture
    element.style.backgroundColor = '#ffffff';
    element.style.color = '#000000';
    element.style.opacity = '1';
    element.style.filter = 'none';
    element.style.mixBlendMode = 'normal';
    element.style.animation = 'none';
    element.style.transform = 'none';
    element.style.height = 'auto';
    element.style.maxHeight = 'none';
    element.style.overflow = 'visible';

    const allElements = element.querySelectorAll('*');
    allElements.forEach(el => {
      const htmlEl = el as HTMLElement;
      (htmlEl.style as any)['webkitPrintColorAdjust'] = 'exact';
      htmlEl.style.printColorAdjust = 'exact';

      htmlEl.style.opacity = '1';
      htmlEl.style.filter = 'none';
      htmlEl.style.mixBlendMode = 'normal';
      htmlEl.style.textShadow = 'none';
      htmlEl.style.animation = 'none';
      htmlEl.style.transform = 'none';

      const tagName = htmlEl.tagName.toLowerCase();
      const isTextElement = ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'strong', 'b', 'em', 'small', 'label', 'a'].includes(tagName);
      const isInDarkSection = Boolean(htmlEl.closest('.standford .left-part, .edinburg .title, .cambridge .title'));

      if (isTextElement) {
        htmlEl.style.color = isInDarkSection ? '#ffffff' : '#000000';
        htmlEl.style.fontWeight = tagName.startsWith('h') || tagName === 'strong' || tagName === 'b' ? '700' : '500';
      }

      if (tagName === 'img' && (htmlEl.classList.contains('profilepic') || htmlEl.classList.contains('profilepicoxford'))) {
        htmlEl.style.borderRadius = '50%';
        htmlEl.style.objectFit = 'cover';
        htmlEl.style.objectPosition = 'center';
        htmlEl.style.aspectRatio = '1 / 1';
        htmlEl.style.display = 'block';
        htmlEl.style.margin = '0 auto';
      }

      if (htmlEl.classList.contains('row')) {
        htmlEl.style.marginLeft = '0';
        htmlEl.style.marginRight = '0';
        htmlEl.style.width = '100%';
      }

      if (htmlEl.className && typeof htmlEl.className === 'string' && htmlEl.className.includes('col-')) {
        htmlEl.style.boxSizing = 'border-box';
        htmlEl.style.minWidth = '0';
      }

      const borderColor = window.getComputedStyle(htmlEl).borderColor;
      if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)') {
        htmlEl.style.borderColor = '#e0e0e0';
      }
    });

    const templateElements = element.querySelectorAll(
      '.auckland, .berkeley, .cambridge, .edinburg, .harvard, .otago, .oxford, .princeton, .standford, .shadow, .containing'
    );

    templateElements.forEach(el => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.height = 'auto';
      htmlEl.style.minHeight = 'auto';
      htmlEl.style.maxHeight = 'none';
      htmlEl.style.overflow = 'visible';
      htmlEl.style.boxSizing = 'border-box';
    });

    element.style.padding = '0';
    element.style.margin = '0';
    element.style.boxSizing = 'border-box';
    element.style.width = '100%';
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
