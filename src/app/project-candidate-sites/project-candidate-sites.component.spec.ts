import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCandidateSitesComponent } from './project-candidate-sites.component';

describe('ProjectCandidateSitesComponent', () => {
  let component: ProjectCandidateSitesComponent;
  let fixture: ComponentFixture<ProjectCandidateSitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectCandidateSitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCandidateSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
