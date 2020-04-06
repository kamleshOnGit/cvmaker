import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BerkeleyComponent } from './berkeley.component';

describe('BerkeleyComponent', () => {
  let component: BerkeleyComponent;
  let fixture: ComponentFixture<BerkeleyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BerkeleyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BerkeleyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
