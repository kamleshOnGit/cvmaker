import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvtemplateComponent } from './cvtemplate.component';

describe('CvtemplateComponent', () => {
  let component: CvtemplateComponent;
  let fixture: ComponentFixture<CvtemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvtemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvtemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
