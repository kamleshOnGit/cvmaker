import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdinburgComponent } from './edinburg.component';

describe('EdinburgComponent', () => {
  let component: EdinburgComponent;
  let fixture: ComponentFixture<EdinburgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdinburgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdinburgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
