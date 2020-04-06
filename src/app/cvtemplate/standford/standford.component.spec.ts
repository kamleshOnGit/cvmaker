import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandfordComponent } from './standford.component';

describe('StandfordComponent', () => {
  let component: StandfordComponent;
  let fixture: ComponentFixture<StandfordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandfordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandfordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
