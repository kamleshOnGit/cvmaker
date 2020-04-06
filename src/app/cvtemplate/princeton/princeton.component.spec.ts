import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincetonComponent } from './princeton.component';

describe('PrincetonComponent', () => {
  let component: PrincetonComponent;
  let fixture: ComponentFixture<PrincetonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrincetonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrincetonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
