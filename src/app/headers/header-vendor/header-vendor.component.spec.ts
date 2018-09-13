import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderVendorComponent } from './header-vendor.component';

describe('HeaderVendorComponent', () => {
  let component: HeaderVendorComponent;
  let fixture: ComponentFixture<HeaderVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
