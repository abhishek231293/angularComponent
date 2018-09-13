import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandApproveComponent } from './land-approve.component';

describe('LandApproveComponent', () => {
  let component: LandApproveComponent;
  let fixture: ComponentFixture<LandApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
