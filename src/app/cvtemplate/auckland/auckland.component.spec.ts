import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AucklandComponent } from './auckland.component';

describe('AucklandComponent', () => {
  let component: AucklandComponent;
  let fixture: ComponentFixture<AucklandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AucklandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AucklandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
