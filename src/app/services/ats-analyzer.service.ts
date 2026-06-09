import { Injectable } from '@angular/core';

export interface ATSAnalysisResult {
  score: number;
  category: 'excellent' | 'good' | 'fair' | 'poor';
  suggestions: ATSSuggestion[];
  keywords: { found: string[]; missing: string[]; density: number };
  format: { issues: FormatIssue[]; isATSFriendly: boolean };
}

export interface ATSSuggestion {
  type: 'critical' | 'warning' | 'info';
  category: 'keywords' | 'format' | 'content' | 'structure';
  message: string;
  action: string;
}

export interface FormatIssue {
  severity: 'error' | 'warning';
  message: string;
  recommendation: string;
}

@Injectable({
  providedIn: 'root'
})
export class ATSAnalyzerService {
  // Industry-specific keywords for ATS optimization
  private commonATSKeywords = [
    'management', 'leadership', 'development', 'analysis', 'project',
    'communication', 'team', 'experience', 'design', 'research',
    'marketing', 'sales', 'customer', 'technical', 'data',
    'software', 'engineering', 'operations', 'strategy', 'planning',
    'budget', 'reporting', 'training', 'support', 'implementation',
    'testing', 'optimization', 'collaboration', 'problem-solving',
    'javascript', 'python', 'java', 'sql', 'react', 'angular',
    'aws', 'azure', 'docker', 'kubernetes', 'agile', 'scrum'
  ];

  private powerVerbs = [
    'achieved', 'improved', 'trained', 'managed', 'created',
    'resolved', 'volunteered', 'increased', 'decreased', 'launched',
    'developed', 'implemented', 'streamlined', 'optimized', 'generated',
    'reduced', 'negotiated', 'coordinated', 'supervised', 'enhanced'
  ];

  analyzeUploadedResume(parsed: any): ATSAnalysisResult {
    const suggestions: ATSSuggestion[] = [];
    const formatIssues: FormatIssue[] = [];
    const foundKeywords: string[] = [];
    const personal = parsed?.personal || {};
    const profileText = parsed?.profile?.text || '';
    const expText = parsed?.experiance?.description || '';
    const eduText = parsed?.education?.description || '';
    const skills: string[] = (parsed?.skills || [])
      .map((s: any) => {
        const raw = typeof s === 'string' ? s : (s?.skill ?? '');
        return typeof raw === 'string' ? raw.trim() : String(raw).trim();
      })
      .filter((s: string) => s.length > 0);

    // Contact info
    if (!personal.firstName && !personal.secondName) {
      suggestions.push({ type: 'critical', category: 'content', message: 'Full name not detected', action: 'Ensure your name is on the first line of your resume in plain text' });
    }
    if (!personal.email) {
      suggestions.push({ type: 'critical', category: 'content', message: 'Email address is missing', action: 'Add a professional email address' });
    }
    if (!personal.phone) {
      suggestions.push({ type: 'warning', category: 'content', message: 'Phone number not detected', action: 'Add a phone number for recruiters to contact you' });
    }
    if (!personal.city) {
      suggestions.push({ type: 'info', category: 'content', message: 'Location not detected', action: 'Add your city and country for local job targeting' });
    }

    // Profile / Summary
    if (!profileText || profileText.trim().length < 50) {
      suggestions.push({ type: 'critical', category: 'content', message: 'Professional summary is missing or too short', action: 'Add a compelling 3-4 sentence professional summary with relevant keywords' });
    } else {
      this.commonATSKeywords.forEach(kw => { if (profileText.toLowerCase().includes(kw)) { foundKeywords.push(kw); } });
      if (!this.powerVerbs.some(v => profileText.toLowerCase().includes(v))) {
        suggestions.push({ type: 'warning', category: 'content', message: 'Summary lacks action-oriented language', action: 'Start sentences with power verbs like "Achieved", "Developed", "Led"' });
      }
    }

    // Experience
    if (!expText || expText.trim().length < 30) {
      suggestions.push({ type: 'critical', category: 'content', message: 'No work experience detected', action: 'Ensure your experience section is labeled "Work Experience" or "Professional Experience"' });
    } else {
      this.commonATSKeywords.forEach(kw => { if (expText.toLowerCase().includes(kw)) { if (!foundKeywords.includes(kw)) { foundKeywords.push(kw); } } });
      if (expText.length < 200) {
        suggestions.push({ type: 'warning', category: 'content', message: 'Experience descriptions are brief', action: 'Add 3-5 bullet points per role with quantifiable achievements' });
      }
      if (!/\d+%?|\$\d+/.test(expText)) {
        suggestions.push({ type: 'info', category: 'content', message: 'No quantifiable achievements found in experience', action: 'Add metrics like "Increased sales by 25%" or "Managed team of 10"' });
      }
    }

    // Education
    if (!eduText || eduText.trim().length < 10) {
      suggestions.push({ type: 'warning', category: 'content', message: 'No education information detected', action: 'Ensure your education section is labeled "Education" and includes your degree and institution' });
    }

    // Skills
    if (skills.length === 0) {
      suggestions.push({ type: 'critical', category: 'structure', message: 'No skills section detected', action: 'Add a dedicated Skills section with 6-12 relevant technical and soft skills' });
    } else {
      skills.forEach(s => {
        const kw = (typeof s === 'string' ? s : String(s)).toLowerCase();
        if (kw && !foundKeywords.includes(kw)) { foundKeywords.push(kw); }
      });
      if (skills.length < 4) {
        suggestions.push({ type: 'info', category: 'content', message: `Only ${skills.length} skill(s) detected`, action: 'Add more relevant skills (aim for 6-12)' });
      }
    }

    // LinkedIn
    if (!personal.linkedin) {
      suggestions.push({ type: 'info', category: 'content', message: 'LinkedIn profile URL not found', action: 'Add your LinkedIn URL to increase credibility' });
    }

    const keywordAnalysis = this.analyzeKeywords(foundKeywords);
    const score = this.calculateFinalScore(suggestions, formatIssues, keywordAnalysis);
    return {
      score,
      category: this.getScoreCategory(score),
      suggestions: this.prioritizeSuggestions(suggestions),
      keywords: keywordAnalysis,
      format: { issues: formatIssues, isATSFriendly: true }
    };
  }

  analyzeResume(formData: any): ATSAnalysisResult {
    const suggestions: ATSSuggestion[] = [];
    const formatIssues: FormatIssue[] = [];
    const foundKeywords: string[] = [];
    let score = 100;

    // Check contact information
    this.checkContactInfo(formData, suggestions);

    // Check summary/profile section
    this.checkProfileSection(formData, suggestions, foundKeywords);

    // Check work experience
    this.checkExperienceSection(formData, suggestions, foundKeywords);

    // Check education
    this.checkEducationSection(formData, suggestions);

    // Check skills section
    this.checkSkillsSection(formData, suggestions, foundKeywords);

    // Check formatting issues
    this.checkFormattingIssues(formData, formatIssues);

    // Calculate keyword density and missing keywords
    const keywordAnalysis = this.analyzeKeywords(foundKeywords);

    // Calculate final score based on issues
    score = this.calculateFinalScore(suggestions, formatIssues, keywordAnalysis);

    const category = this.getScoreCategory(score);

    return {
      score,
      category,
      suggestions: this.prioritizeSuggestions(suggestions),
      keywords: keywordAnalysis,
      format: {
        issues: formatIssues,
        isATSFriendly: formatIssues.filter(i => i.severity === 'error').length === 0
      }
    };
  }

  private checkContactInfo(formData: any, suggestions: ATSSuggestion[]): void {
    const personal = formData?.personal || {};

    if (!personal.firstName || !personal.secondName) {
      suggestions.push({
        type: 'critical',
        category: 'content',
        message: 'Missing complete name in contact information',
        action: 'Add both first and last name to your resume'
      });
    }

    if (!personal.email) {
      suggestions.push({
        type: 'critical',
        category: 'content',
        message: 'Email address is missing',
        action: 'Add a professional email address'
      });
    } else if (!this.isValidEmail(personal.email)) {
      suggestions.push({
        type: 'warning',
        category: 'format',
        message: 'Email format may not be ATS-friendly',
        action: 'Use a standard email format (name@domain.com)'
      });
    }

    if (!personal.phone) {
      suggestions.push({
        type: 'warning',
        category: 'content',
        message: 'Phone number is missing',
        action: 'Add a phone number for better contactability'
      });
    }

    if (!personal.city || !personal.country) {
      suggestions.push({
        type: 'info',
        category: 'content',
        message: 'Location information is incomplete',
        action: 'Add city and country for local job targeting'
      });
    }
  }

  private checkProfileSection(formData: any, suggestions: ATSSuggestion[], foundKeywords: string[]): void {
    const profile = formData?.profile?.profiledata || '';

    if (!profile || profile.trim().length < 50) {
      suggestions.push({
        type: 'critical',
        category: 'content',
        message: 'Professional summary is missing or too short',
        action: 'Add a compelling 3-4 sentence professional summary with relevant keywords'
      });
    } else {
      // Check for keywords in profile
      this.commonATSKeywords.forEach(keyword => {
        if (profile.toLowerCase().includes(keyword.toLowerCase())) {
          if (!foundKeywords.includes(keyword)) {
            foundKeywords.push(keyword);
          }
        }
      });

      // Check for power verbs
      const hasPowerVerbs = this.powerVerbs.some(verb =>
        profile.toLowerCase().includes(verb.toLowerCase())
      );

      if (!hasPowerVerbs) {
        suggestions.push({
          type: 'warning',
          category: 'content',
          message: 'Summary lacks action-oriented language',
          action: 'Start sentences with power verbs like "Achieved", "Developed", "Led"'
        });
      }

      // Check length
      if (profile.length > 600) {
        suggestions.push({
          type: 'warning',
          category: 'content',
          message: 'Professional summary is too long',
          action: 'Keep summary concise (3-5 sentences) for better ATS parsing'
        });
      }
    }
  }

  private checkExperienceSection(formData: any, suggestions: ATSSuggestion[], foundKeywords: string[]): void {
    const hasExperience = formData?.experiance?.experiance1 ||
                         formData?.experiance2?.experiance2 ||
                         formData?.experiance3?.experiance3;

    if (!hasExperience) {
      suggestions.push({
        type: 'critical',
        category: 'content',
        message: 'No work experience listed',
        action: 'Add at least one work experience entry with detailed descriptions'
      });
      return;
    }

    // Check experience descriptions
    ['experiance', 'experiance2', 'experiance3'].forEach((key, index) => {
      const exp = formData[key]?.[`${key}${index === 0 ? '' : index + 1}`];
      if (exp?.description) {
        const desc = exp.description;

        // Check for keywords
        this.commonATSKeywords.forEach(keyword => {
          if (desc.toLowerCase().includes(keyword.toLowerCase())) {
            if (!foundKeywords.includes(keyword)) {
              foundKeywords.push(keyword);
            }
          }
        });

        // Check description length
        if (desc.length < 100) {
          suggestions.push({
            type: 'warning',
            category: 'content',
            message: `Experience entry ${index + 1} has a short description`,
            action: 'Add 3-5 bullet points with quantifiable achievements'
          });
        }

        // Check for metrics/numbers
        if (!/\d+%?|\$\d+/.test(desc)) {
          suggestions.push({
            type: 'info',
            category: 'content',
            message: `Experience entry ${index + 1} lacks quantifiable achievements`,
            action: 'Add metrics like "Increased sales by 25%" or "Managed $1M budget"'
          });
        }
      }
    });

    // Check for employment gaps
    const hasMultipleExperiences = formData?.experiance2 || formData?.experiance3;
    if (!hasMultipleExperiences) {
      suggestions.push({
        type: 'info',
        category: 'content',
        message: 'Limited work history shown',
        action: 'If applicable, add internships, volunteer work, or projects'
      });
    }
  }

  private checkEducationSection(formData: any, suggestions: ATSSuggestion[]): void {
    const hasEducation = formData?.education?.education1 ||
                        formData?.education2?.education2 ||
                        formData?.education3?.education3;

    if (!hasEducation) {
      suggestions.push({
        type: 'warning',
        category: 'content',
        message: 'No education information found',
        action: 'Add your educational background including degrees and institutions'
      });
    }
  }

  private checkSkillsSection(formData: any, suggestions: ATSSuggestion[], foundKeywords: string[]): void {
    const hasSkills = formData?.skills?.skill1 || formData?.skills2?.skills2 || formData?.skills3?.skills3;

    if (!hasSkills) {
      suggestions.push({
        type: 'critical',
        category: 'structure',
        message: 'No skills section found',
        action: 'Add a dedicated skills section with 6-12 relevant technical and soft skills'
      });
    } else {
      // Count skills
      let skillCount = 0;
      ['skill1', 'skills2', 'skills3'].forEach((key, idx) => {
        const skillKey = idx === 0 ? 'skill1' : `skills${idx + 1}`;
        const skillData = idx === 0 ? formData?.skills?.[skillKey] : formData?.[`skills${idx + 1}`]?.[skillKey];
        if (skillData?.skill) {
          skillCount++;
          if (!foundKeywords.includes(skillData.skill.toLowerCase())) {
            foundKeywords.push(skillData.skill.toLowerCase());
          }
        }
      });

      if (skillCount < 4) {
        suggestions.push({
          type: 'info',
          category: 'content',
          message: 'Limited skills listed',
          action: 'Add more relevant skills (aim for 6-12 skills total)'
        });
      }
    }

    // Check courses/certifications
    const hasCourses = formData?.courses?.course1 || formData?.courses2 || formData?.courses3;
    if (!hasCourses) {
      suggestions.push({
        type: 'info',
        category: 'content',
        message: 'No certifications or courses listed',
        action: 'Add relevant certifications to improve credibility'
      });
    }
  }

  private checkFormattingIssues(formData: any, issues: FormatIssue[]): void {
    // Check for common formatting problems that affect ATS
    const hasSpecialChars = /[\u2713\u2714\u2611\u25CF\u25CB\u26AB]/.test(JSON.stringify(formData));
    if (hasSpecialChars) {
      issues.push({
        severity: 'warning',
        message: 'Special Unicode characters detected',
        recommendation: 'Use standard ASCII characters for better ATS compatibility'
      });
    }

    // Check for extremely long entries
    const allText = JSON.stringify(formData);
    if (allText.length > 15000) {
      issues.push({
        severity: 'warning',
        message: 'Resume content is very long',
        recommendation: 'Keep resume to 1-2 pages for optimal ATS parsing'
      });
    }
  }

  private analyzeKeywords(foundKeywords: string[]): { found: string[]; missing: string[]; density: number } {
    const missing = this.commonATSKeywords.filter(
      keyword => !foundKeywords.includes(keyword.toLowerCase())
    );

    // Calculate keyword density (simple version)
    const density = foundKeywords.length > 0
      ? Math.min((foundKeywords.length / this.commonATSKeywords.length) * 100, 100)
      : 0;

    return {
      found: foundKeywords,
      missing: missing.slice(0, 10), // Show top 10 missing
      density: Math.round(density)
    };
  }

  private calculateFinalScore(
    suggestions: ATSSuggestion[],
    formatIssues: FormatIssue[],
    keywordAnalysis: { density: number }
  ): number {
    let score = 100;

    // Deduct for critical issues
    const criticalCount = suggestions.filter(s => s.type === 'critical').length;
    score -= criticalCount * 15;

    // Deduct for warnings
    const warningCount = suggestions.filter(s => s.type === 'warning').length;
    score -= warningCount * 8;

    // Deduct for format errors
    const formatErrors = formatIssues.filter(i => i.severity === 'error').length;
    score -= formatErrors * 10;

    // Add keyword density bonus (up to 20 points)
    score += Math.min(keywordAnalysis.density * 0.2, 20);

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private getScoreCategory(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  }

  private prioritizeSuggestions(suggestions: ATSSuggestion[]): ATSSuggestion[] {
    const priorityOrder = { 'critical': 0, 'warning': 1, 'info': 2 };
    return suggestions.sort((a, b) => priorityOrder[a.type] - priorityOrder[b.type]);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Generate ATS-friendly tips for form fields
  getFieldTips(fieldName: string): string {
    const tips: { [key: string]: string } = {
      'firstName': 'Use your full legal name as it appears on official documents',
      'secondName': 'Include your last name/family name',
      'email': 'Use a professional email (avoid nicknames or numbers if possible)',
      'phone': 'Include country code for international applications (+1, +44, etc.)',
      'address': 'City and country/state are usually sufficient for ATS',
      'profile': 'Write 3-5 sentences highlighting your expertise, years of experience, and key achievements',
      'jobTitle': 'Use standard job titles ("Software Engineer" not "Coding Ninja")',
      'employer': 'Include full company name, avoid abbreviations',
      'description': 'Start with action verbs, include metrics, use 3-5 bullet points',
      'skill': 'Use standard skill names ("JavaScript" not "JS", "Project Management" not "PM")',
      'degree': 'Use standard degree names ("Bachelor of Science" not "BS")',
      'school': 'Include full institution name',
      'interest': 'Keep professional and relevant to the role',
      'language': 'Include proficiency level (Native, Fluent, Professional, Basic)'
    };

    return tips[fieldName] || '';
  }
}
