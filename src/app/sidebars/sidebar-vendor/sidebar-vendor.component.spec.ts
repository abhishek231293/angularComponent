import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarVendorComponent } from './sidebar-vendor.component';

describe('SidebarVendorComponent', () => {
  let component: SidebarVendorComponent;
  let fixture: ComponentFixture<SidebarVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
