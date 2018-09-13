import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRefComponent } from './project-ref.component';

describe('ProjectRefComponent', () => {
  let component: ProjectRefComponent;
  let fixture: ComponentFixture<ProjectRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
