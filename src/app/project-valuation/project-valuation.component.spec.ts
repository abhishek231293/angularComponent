import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectValuationComponent } from './project-valuation.component';

describe('ProjectValuationComponent', () => {
  let component: ProjectValuationComponent;
  let fixture: ComponentFixture<ProjectValuationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectValuationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectValuationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
