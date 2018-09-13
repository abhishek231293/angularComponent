import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpfDesignComponent } from './rpf-design.component';

describe('RpfDesignComponent', () => {
  let component: RpfDesignComponent;
  let fixture: ComponentFixture<RpfDesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpfDesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpfDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
