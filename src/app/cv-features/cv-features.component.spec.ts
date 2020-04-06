import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvFeaturesComponent } from './cv-features.component';

describe('CvFeaturesComponent', () => {
  let component: CvFeaturesComponent;
  let fixture: ComponentFixture<CvFeaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvFeaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
