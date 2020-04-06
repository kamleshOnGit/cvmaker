import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvardComponent } from './harvard.component';

describe('HarvardComponent', () => {
  let component: HarvardComponent;
  let fixture: ComponentFixture<HarvardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HarvardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
