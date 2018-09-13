import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderProjectNologinComponent } from './header-project-nologin.component';

describe('HeaderProjectNologinComponent', () => {
  let component: HeaderProjectNologinComponent;
  let fixture: ComponentFixture<HeaderProjectNologinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderProjectNologinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderProjectNologinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
