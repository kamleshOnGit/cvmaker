import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResumeCheckerComponent } from './resume-checker.component';

describe('ResumeCheckerComponent', () => {
  let component: ResumeCheckerComponent;
  let fixture: ComponentFixture<ResumeCheckerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({ declarations: [ResumeCheckerComponent] }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy(); });
});
