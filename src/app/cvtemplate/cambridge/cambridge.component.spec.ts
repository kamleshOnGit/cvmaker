import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambridgeComponent } from './cambridge.component';

describe('CambridgeComponent', () => {
  let component: CambridgeComponent;
  let fixture: ComponentFixture<CambridgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambridgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambridgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
