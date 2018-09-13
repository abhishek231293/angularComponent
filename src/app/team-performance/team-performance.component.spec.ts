import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPerformanceComponent } from './team-performance.component';

describe('TeamPerformanceComponent', () => {
  let component: TeamPerformanceComponent;
  let fixture: ComponentFixture<TeamPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
