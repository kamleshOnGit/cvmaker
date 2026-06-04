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
        <span class="badge badge-light" [class]="'score-' + analysis?.category">
          {{ analysis?.score }}/100
        </span>
      </div>
      <div class="card-body">
        <!-- Score Ring -->
        <div class="score-section text-center mb-4">
          <div class="score-ring" [class]="'category-' + analysis?.category">
            <svg viewBox="0 0 36 36" class="circular-chart">
              <path class="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path class="circle"
                [attr.stroke-dasharray]="analysis?.score + ', 100'"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div class="score-text">
              <span class="score-value">{{ analysis?.score }}</span>
              <span class="score-label">ATS Score</span>
            </div>
          </div>
          <div class="category-badge mt-2" [class]="'badge-' + analysis?.category">
            {{ getCategoryLabel(analysis?.category) }}
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="quick-stats row mb-4">
          <div class="col-4 text-center">
            <div class="stat-item">
              <fa-icon [icon]="['fas', 'tags']" class="text-primary"></fa-icon>
              <div class="stat-value">{{ analysis?.keywords?.found?.length || 0 }}</div>
              <div class="stat-label">Keywords Found</div>
            </div>
          </div>
          <div class="col-4 text-center">
            <div class="stat-item">
              <fa-icon [icon]="['fas', 'file-alt']" class="text-success"></fa-icon>
              <div class="stat-value">{{ analysis?.format?.isATSFriendly ? 'Yes' : 'No' }}</div>
              <div class="stat-label">ATS Friendly</div>
            </div>
          </div>
          <div class="col-4 text-center">
            <div class="stat-item">
              <fa-icon [icon]="['fas', 'percentage']" class="text-info"></fa-icon>
              <div class="stat-value">{{ analysis?.keywords?.density || 0 }}%</div>
              <div class="stat-label">Keyword Density</div>
            </div>
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
                 [class]="'type-' + suggestion.type">
              <div class="suggestion-icon">
                <fa-icon [icon]="getSuggestionIcon(suggestion.type)"></fa-icon>
              </div>
              <div class="suggestion-content">
                <div class="suggestion-header">
                  <span class="badge badge-pill" [class]="'badge-' + suggestion.type">
                    {{ suggestion.type | uppercase }}
                  </span>
                  <span class="category-badge">{{ suggestion.category }}</span>
                </div>
                <p class="suggestion-message">{{ suggestion.message }}</p>
                <p class="suggestion-action">
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

    .score-ring {
      position: relative;
      width: 150px;
      height: 150px;
      margin: 0 auto;
    }

    .circular-chart {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .circle-bg {
      fill: none;
      stroke: #eee;
      stroke-width: 3;
    }

    .circle {
      fill: none;
      stroke-width: 3;
      stroke-linecap: round;
      animation: progressAnimation 1s ease-out forwards;
    }

    @keyframes progressAnimation {
      from {
        stroke-dasharray: 0, 100;
      }
    }

    .score-value {
      animation: fadeInScale 0.6s ease-out 0.3s both;
    }

    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.5);
      }
      to {
        opacity: 1;
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

    .category-excellent .circle { stroke: #28a745; }
    .category-good .circle { stroke: #17a2b8; }
    .category-fair .circle { stroke: #ffc107; }
    .category-poor .circle { stroke: #dc3545; }

    .score-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .score-value {
      display: block;
      font-size: 2.5rem;
      font-weight: bold;
      color: #333;
    }

    .score-label {
      font-size: 0.75rem;
      color: #666;
      text-transform: uppercase;
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

    .quick-stats {
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .stat-item {
      padding: 0.5rem;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: bold;
      color: #333;
      margin: 0.25rem 0;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #666;
    }

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
  @Input() analysis!: ATSAnalysisResult;

  ngOnInit(): void {}

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
    return this.analysis?.suggestions?.some(s => s.type === 'critical') || false;
  }

  hasValidSuggestions(): boolean {
    return (this.analysis?.suggestions || []).some(s => s.message && s.message.trim());
  }

  getValidSuggestions(): ATSSuggestion[] {
    return (this.analysis?.suggestions || []).filter(s => s.message && s.message.trim());
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
