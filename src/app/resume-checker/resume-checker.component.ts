import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  faUpload, faCheckCircle, faTimesCircle, faExclamationTriangle,
  faInfoCircle, faRobot, faChartBar, faLightbulb, faSearch,
  faFileAlt, faSpinner, faTimes, faCheck
} from '@fortawesome/free-solid-svg-icons';
import { ATSAnalyzerService, ATSAnalysisResult } from '../services/ats-analyzer.service';
import * as pdfjsLib from 'pdfjs-dist';

interface ParsedResume {
  personal: {
    firstName: string; secondName: string; email: string;
    phone: string; city: string; country: string; linkedin: string; title: string;
  };
  profile: { text: string };
  experiance: {
    jobTitle: string; employer: string; city: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    description: string;
  };
  education: {
    degree: string; school: string; city: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    description: string;
  };
  skills: { skill: string }[];
}

@Component({
  selector: 'app-resume-checker',
  templateUrl: './resume-checker.component.html',
  styleUrls: ['./resume-checker.component.scss']
})
export class ResumeCheckerComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;

  faUpload = faUpload;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  faExclamationTriangle = faExclamationTriangle;
  faInfoCircle = faInfoCircle;
  faRobot = faRobot;
  faChartBar = faChartBar;
  faLightbulb = faLightbulb;
  faSearch = faSearch;
  faFileAlt = faFileAlt;
  faSpinner = faSpinner;
  faTimes = faTimes;
  faCheck = faCheck;

  isDragging = false;
  isAnalyzing = false;
  fileName = '';
  fileSize = '';
  fileError = '';
  rawText = '';
  analysis: ATSAnalysisResult = null;
  showEditor = false;

  manualForm: FormGroup;
  activeTab: 'upload' | 'paste' = 'upload';

  constructor(
    private fb: FormBuilder,
    private atsService: ATSAnalyzerService,
    private cdr: ChangeDetectorRef
  ) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
  }

  ngOnInit() {
    this.manualForm = this.fb.group({
      firstName: ['', Validators.required],
      secondName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      title: [''],
      summary: [''],
      skills: [''],
      experience: [''],
      education: [''],
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  processFile(file: File) {
    this.fileError = '';
    if (!file.name.match(/\.(pdf|txt|doc|docx)$/i)) {
      this.fileError = 'Please upload a PDF, Word (.doc/.docx), or plain text (.txt) file.';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.fileError = 'File size must be under 5 MB.';
      return;
    }
    this.fileName = file.name;
    this.fileSize = (file.size / 1024).toFixed(1) + ' KB';
    this.isAnalyzing = true;
    this.analysis = null;

    if (file.name.match(/\.pdf$/i)) {
      this.extractPdfText(file).then(text => {
        this.rawText = text;
        this.runAnalysisFromText(text);
      }).catch(() => {
        this.fileError = 'Could not read PDF. Try the Paste Text tab instead.';
        this.isAnalyzing = false;
        this.cdr.detectChanges();
      });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.rawText = (e.target.result as string) || '';
        this.runAnalysisFromText(this.rawText);
      };
      reader.readAsText(file);
    }
  }

  private async extractPdfText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const items = content.items as any[];
      let lastY: number | null = null;
      let lineText = '';
      for (const item of items) {
        const y = item.transform ? Math.round(item.transform[5]) : 0;
        if (lastY !== null && Math.abs(y - lastY) > 3) {
          fullText += lineText.trim() + '\n';
          lineText = '';
        }
        lineText += item.str + ' ';
        lastY = y;
      }
      if (lineText.trim()) { fullText += lineText.trim() + '\n'; }
      fullText += '\n';
    }
    return fullText;
  }

  runAnalysisFromText(text: string) {
    const parsed = this.parseTextToFormData(text);
    this.populateEditor(parsed);
    this.isAnalyzing = true;
    this.analysis = null;
    setTimeout(() => {
      this.analysis = this.atsService.analyzeUploadedResume(parsed);
      this.isAnalyzing = false;
      this.cdr.detectChanges();
    }, 1200);
  }

  runAnalysisFromPaste() {
    if (!this.rawText.trim()) { return; }
    this.runAnalysisFromText(this.rawText);
  }

  runAnalysisFromForm() {
    if (this.manualForm.invalid) {
      this.manualForm.markAllAsTouched();
      return;
    }
    const v = this.manualForm.value;
    const skillsList = (v.skills || '').split(/[,\n]/).map((s: string) => s.trim()).filter(Boolean);
    const formData = {
      personal: {
        firstName: v.firstName, secondName: v.secondName,
        email: v.email, phone: v.phone, title: v.title,
        city: '', country: '', linkedin: ''
      },
      profile: { text: v.summary },
      experiance: {
        jobTitle: '', employer: '', city: '',
        startDate: { month: '', year: '' }, endDate: { month: '', year: '' },
        description: v.experience
      },
      education: {
        degree: '', school: '', city: '',
        startDate: { month: '', year: '' }, endDate: { month: '', year: '' },
        description: v.education
      },
      skills: skillsList.length ? skillsList : [{ skill: '' }]
    };
    this.isAnalyzing = true;
    this.analysis = null;
    setTimeout(() => {
      this.analysis = this.atsService.analyzeUploadedResume(formData);
      this.isAnalyzing = false;
      this.cdr.detectChanges();
    }, 1200);
  }

  populateEditor(parsed: any) {
    const skills = (parsed?.skills || []).map((s: any) => s.skill || s).filter(Boolean).join(', ');
    this.manualForm.patchValue({
      firstName: parsed?.personal?.firstName || '',
      secondName: parsed?.personal?.secondName || '',
      email: parsed?.personal?.email || '',
      phone: parsed?.personal?.phone || '',
      title: parsed?.personal?.title || '',
      summary: parsed?.profile?.text || '',
      skills,
      experience: parsed?.experiance?.description || '',
      education: parsed?.education?.description || ''
    });
  }

  openEditor() {
    this.showEditor = true;
  }

  private parseTextToFormData(text: string): any {
    const normalized = text.replace(/\r/g, '').replace(/[ \t]+/g, ' ');
    const lines = normalized.split('\n').map(l => l.trim()).filter(Boolean);

    const emailMatch = text.match(/[\w.+'-]+@[\w.-]+\.[a-zA-Z]{2,}/i);
    const phoneMatch = text.match(/(\+?\d[\d\s().\-]{7,}\d)/);
    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);

    const sectionMap: Record<string, string[]> = {};
    let currentSection = 'header';
    sectionMap['header'] = [];

    const isSectionHeader = (line: string): string | null => {
      const l = line.toLowerCase().replace(/[^a-z ]/g, '').trim();
      if (/^(skills|technical skills|core skills|key skills|competencies|expertise|technologies)/.test(l)) { return 'skills'; }
      if (/^(work experience|professional experience|experience|employment|career history|work history)/.test(l)) { return 'experience'; }
      if (/^(education|academic|qualifications|degrees)/.test(l)) { return 'education'; }
      if (/^(summary|professional summary|profile|about me|objective|career objective)/.test(l)) { return 'profile'; }
      if (/^(projects|certifications|awards|languages|interests|hobbies)/.test(l)) { return 'other'; }
      return null;
    };

    for (const line of lines) {
      const section = isSectionHeader(line);
      if (section) {
        currentSection = section;
        if (!sectionMap[currentSection]) { sectionMap[currentSection] = []; }
        continue;
      }
      if (!sectionMap[currentSection]) { sectionMap[currentSection] = []; }
      sectionMap[currentSection].push(line);
    }

    const headerLines = sectionMap['header'] || [];
    const nameLine = headerLines.find(l =>
      l.length > 2 && l.length < 60 &&
      !l.match(/@/) &&
      !l.match(/^\d/) &&
      !l.match(/http/i)
    ) || '';
    const nameParts = nameLine.trim().split(/\s+/);

    const skillsRaw = (sectionMap['skills'] || []).join(' , ');
    const skills = skillsRaw
      .split(/[,•|\n\t]|\s{2,}/)
      .map(s => s.trim())
      .filter(s => s.length > 1 && s.length < 50);

    const expText = (sectionMap['experience'] || []).join(' ');
    const eduText = (sectionMap['education'] || []).join(' ');
    const profileText = (sectionMap['profile'] || []).join(' ');

    const cityMatch = text.match(/\b([A-Z][a-z]+(?:[\s-][A-Z][a-z]+)?),?\s*([A-Z]{2}|[A-Z][a-z]+)\b/);

    return {
      personal: {
        firstName: nameParts[0] || '',
        secondName: nameParts.slice(1).join(' ') || '',
        email: emailMatch ? emailMatch[0] : '',
        phone: phoneMatch ? phoneMatch[1] : '',
        title: headerLines.find(l =>
          l.length > 3 && l.length < 80 && l !== nameLine &&
          !l.match(/@/) && !l.match(/^\d{10}/) && !l.match(/http/i)
        ) || '',
        city: cityMatch ? cityMatch[1] : '',
        country: '',
        linkedin: linkedinMatch ? linkedinMatch[0] : ''
      },
      profile: { text: profileText.trim() || (expText.length > 50 ? expText.substring(0, 500) : text.substring(0, 500)) },
      experiance: {
        jobTitle: '', employer: '', city: '',
        startDate: { month: '', year: '' }, endDate: { month: '', year: '' },
        description: expText.trim()
      },
      education: {
        degree: '', school: '', city: '',
        startDate: { month: '', year: '' }, endDate: { month: '', year: '' },
        description: eduText.trim()
      },
      skills: skills.length > 0 ? skills.map(s => ({ skill: s })) : [{ skill: '' }]
    };
  }

  clearFile() {
    this.fileName = '';
    this.fileSize = '';
    this.rawText = '';
    this.analysis = null;
    this.fileError = '';
    if (this.fileInput) { this.fileInput.nativeElement.value = ''; }
  }

  getScoreColor(): string {
    if (!this.analysis) { return '#667eea'; }
    if (this.analysis.score >= 80) { return '#38a169'; }
    if (this.analysis.score >= 60) { return '#d69e2e'; }
    return '#e53e3e';
  }

  getScoreArc(): string {
    if (!this.analysis) { return '0 251.2'; }
    const pct = Math.min(this.analysis.score, 100) / 100;
    return `${pct * 251.2} 251.2`;
  }

  getValidSuggestions() {
    return (this.analysis?.suggestions || []).filter(s => s.message && s.message.trim());
  }

  getSuggestionIcon(type: string) {
    if (type === 'critical') { return this.faTimesCircle; }
    if (type === 'warning') { return this.faExclamationTriangle; }
    return this.faInfoCircle;
  }
}
