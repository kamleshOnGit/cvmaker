import { Component, Input, OnInit } from '@angular/core';
import { ATSAnalysisResult, ATSSuggestion } from '../services/ats-analyzer.service';

@Component({
  selector: 'app-ats-analyzer',
  template: `
    <div class="ats-analyzer card shadow-lg mb-4">
      <div class="card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center">
        <h5 class="mb-0">
          <fa-icon [icon]="['fas', 'robot']" class="mr-2"></fa-icon>
          ATS Compatibility Check
        </h5>
        <span class="badge badge-light" [ngClass]="'score-' + analysis?.category">
          <span [textContent]="scoreText"></span>/100
        </span>
      </div>
      <div class="card-body">
        <!-- Score Ring -->
        <div class="score-section text-center mb-4">
          <div class="ats-score-circle" [ngClass]="'category-' + analysis?.category">
            <div class="ats-score-number" [textContent]="scoreText"></div>
            <div class="ats-score-label">ATS Score</div>
          </div>
          <div class="ats-stats-row">
            <div class="ats-stat">
              <div class="ats-stat-value" [textContent]="keywordsFoundText"></div>
              <div class="ats-stat-label">Keywords Found</div>
            </div>
            <div class="ats-stat">
              <div class="ats-stat-value" [textContent]="atsFriendlyText"></div>
              <div class="ats-stat-label">ATS Friendly</div>
            </div>
            <div class="ats-stat">
              <div class="ats-stat-value" [textContent]="keywordDensityText"></div>
              <div class="ats-stat-label">Keyword Density</div>
            </div>
          </div>
          <div class="category-badge mt-2" [ngClass]="'badge-' + analysis?.category">
            {{ getCategoryLabel(analysis?.category) }}
          </div>
        </div>

        <!-- Critical Issues Alert -->
        <div class="alert alert-danger" *ngIf="hasCriticalIssues()">
          <fa-icon [icon]="['fas', 'exclamation-triangle']" class="mr-2"></fa-icon>
          <strong>Critical Issues Found!</strong> Fix these to improve your ATS score.
        </div>

        <!-- Suggestions List -->
        <div class="suggestions-section" *ngIf="hasValidSuggestions()">
          <h6 class="section-title">
            <fa-icon [icon]="['fas', 'lightbulb']" class="mr-2 text-warning"></fa-icon>
            Improvement Suggestions
          </h6>
          <div class="suggestion-list">
            <div *ngFor="let suggestion of getValidSuggestions()"
                 class="suggestion-item"
                 [ngClass]="'type-' + suggestion.type">
              <div class="suggestion-icon">
                <fa-icon [icon]="getSuggestionIcon(suggestion.type)"></fa-icon>
              </div>
              <div class="suggestion-content">
                <div class="suggestion-header">
                  <span class="badge badge-pill" [ngClass]="'badge-' + suggestion.type">
                    {{ suggestion.type | uppercase }}
                  </span>
                  <span class="category-badge">{{ suggestion.category }}</span>
                </div>
                <p class="suggestion-message" *ngIf="suggestion.message && suggestion.message.trim()">{{ suggestion.message }}</p>
                <p class="suggestion-action" *ngIf="suggestion.action && suggestion.action.trim()">
                  <fa-icon [icon]="['fas', 'arrow-right']" class="mr-1"></fa-icon>
                  {{ suggestion.action }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Keywords Section -->
        <div class="keywords-section mt-4" *ngIf="analysis?.keywords?.found?.length > 0">
          <h6 class="section-title">
            <fa-icon [icon]="['fas', 'key']" class="mr-2 text-success"></fa-icon>
            Keywords Detected
          </h6>
          <div class="keyword-chips">
            <span *ngFor="let keyword of analysis?.keywords?.found?.slice(0, 15)"
                  class="badge badge-success keyword-chip">
              {{ keyword }}
            </span>
          </div>
        </div>

        <!-- Missing Keywords -->
        <div class="missing-keywords mt-3" *ngIf="analysis?.keywords?.missing?.length > 0">
          <h6 class="section-title text-muted">
            <fa-icon [icon]="['fas', 'plus-circle']" class="mr-2"></fa-icon>
            Suggested Keywords to Add
          </h6>
          <div class="keyword-chips">
            <span *ngFor="let keyword of analysis?.keywords?.missing"
                  class="badge badge-outline-secondary keyword-chip">
              {{ keyword }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ats-analyzer {
      border: none;
      border-radius: 12px;
      overflow: hidden;
    }

    .bg-gradient-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .ats-score-circle {
      width: 150px;
      height: 150px;
      margin: 0 auto;
      border-radius: 50%;
      border: 12px solid #e9ecef;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      animation: scorePop 0.45s ease-out;
    }

    @keyframes scorePop {
      from {
        transform: scale(0.92);
      }
      to {
        transform: scale(1);
      }
    }

    .category-badge {
      animation: slideUp 0.5s ease-out 0.5s both;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .category-excellent { border-color: #28a745; }
    .category-good { border-color: #17a2b8; }
    .category-fair { border-color: #ffc107; }
    .category-poor { border-color: #dc3545; }

    .ats-score-number {
      display: block !important;
      font-size: 2.5rem !important;
      font-weight: 800 !important;
      color: #333 !important;
      line-height: 1 !important;
      opacity: 1 !important;
      visibility: visible !important;
      min-height: 42px;
    }

    .ats-score-label {
      display: block !important;
      margin-top: 0.35rem;
      font-size: 0.75rem !important;
      color: #666 !important;
      text-transform: uppercase;
      opacity: 1 !important;
      visibility: visible !important;
    }

    .ats-stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
      padding: 1rem;
      margin-top: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .ats-stat {
      text-align: center;
      padding: 0.5rem;
    }

    .ats-stat-value {
      display: block !important;
      font-size: 1.25rem !important;
      font-weight: 800 !important;
      color: #333 !important;
      margin: 0.25rem 0;
      opacity: 1 !important;
      visibility: visible !important;
    }

    .ats-stat-label {
      display: block !important;
      font-size: 0.75rem !important;
      color: #666 !important;
      opacity: 1 !important;
      visibility: visible !important;
    }

    .category-badge {
      display: inline-block;
      padding: 0.5rem 1.5rem;
      border-radius: 20px;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.875rem;
    }

    .badge-excellent { background: #d4edda; color: #155724; }
    .badge-good { background: #d1ecf1; color: #0c5460; }
    .badge-fair { background: #fff3cd; color: #856404; }
    .badge-poor { background: #f8d7da; color: #721c24; }

    .section-title {
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 1rem;
      color: #333;
    }

    .suggestion-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .suggestion-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border-radius: 8px;
      background: #f8f9fa;
      transition: transform 0.2s;
    }

    .suggestion-item:hover {
      transform: translateX(4px);
    }

    .type-critical { border-left: 4px solid #dc3545; }
    .type-warning { border-left: 4px solid #ffc107; }
    .type-info { border-left: 4px solid #17a2b8; }

    .suggestion-icon {
      font-size: 1.25rem;
      color: #666;
    }

    .type-critical .suggestion-icon { color: #dc3545; }
    .type-warning .suggestion-icon { color: #ffc107; }
    .type-info .suggestion-icon { color: #17a2b8; }

    .suggestion-content {
      flex: 1;
    }

    .suggestion-header {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .badge-critical { background: #dc3545; }
    .badge-warning { background: #ffc107; color: #000; }
    .badge-info { background: #17a2b8; }

    .category-badge {
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #666;
    }

    .suggestion-message {
      font-weight: 500;
      margin-bottom: 0.25rem;
      color: #333 !important;
    }

    .suggestion-action {
      font-size: 0.875rem;
      margin-bottom: 0;
      color: #666 !important;
    }

    .keyword-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .keyword-chip {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
    }

    .badge-outline-secondary {
      border: 1px solid #6c757d;
      color: #6c757d;
      background: transparent;
    }

    .score-excellent { background: #28a745; color: white; }
    .score-good { background: #17a2b8; color: white; }
    .score-fair { background: #ffc107; color: #000; }
    .score-poor { background: #dc3545; color: white; }
  `]
})
export class AtsAnalyzerComponent implements OnInit {
  private _analysis!: ATSAnalysisResult;

  @Input()
  set analysis(value: ATSAnalysisResult) {
    this._analysis = value;
  }

  get analysis(): ATSAnalysisResult {
    return this._analysis;
  }

  ngOnInit(): void {}

  get scoreText(): string {
    const score = this.analysis?.score;
    return score === undefined || score === null ? '0' : String(score);
  }

  get keywordsFoundText(): string {
    return String(this.analysis?.keywords?.found?.length || 0);
  }

  get atsFriendlyText(): string {
    return this.analysis?.format?.isATSFriendly ? 'Yes' : 'No';
  }

  get keywordDensityText(): string {
    return `${this.analysis?.keywords?.density || 0}%`;
  }

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      'excellent': 'ATS Optimized ✓',
      'good': 'ATS Friendly',
      'fair': 'Needs Improvement',
      'poor': 'Major Issues Found'
    };
    return labels[category] || category;
  }

  hasCriticalIssues(): boolean {
    return this.getValidSuggestions().some(s => s.type === 'critical');
  }

  hasValidSuggestions(): boolean {
    return this.getValidSuggestions().length > 0;
  }

  getValidSuggestions(): ATSSuggestion[] {
    return (this.analysis?.suggestions || []).filter(s => {
      const message = typeof s?.message === 'string' ? s.message.trim() : '';
      const action = typeof s?.action === 'string' ? s.action.trim() : '';
      return message.length > 0 || action.length > 0;
    });
  }

  getSuggestionIcon(type: string): string[] {
    const icons: { [key: string]: string[] } = {
      'critical': ['fas', 'exclamation-circle'],
      'warning': ['fas', 'exclamation-triangle'],
      'info': ['fas', 'info-circle']
    };
    return icons[type] || ['fas', 'info-circle'];
  }
}
