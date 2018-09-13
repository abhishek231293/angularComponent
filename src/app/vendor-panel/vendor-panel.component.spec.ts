import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorPanelComponent } from './vendor-panel.component';

describe('VendorPanelComponent', () => {
  let component: VendorPanelComponent;
  let fixture: ComponentFixture<VendorPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
