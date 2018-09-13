import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteReportComponent } from './site-report.component';

describe('SiteReportComponent', () => {
  let component: SiteReportComponent;
  let fixture: ComponentFixture<SiteReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
