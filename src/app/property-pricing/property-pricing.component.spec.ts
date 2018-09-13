import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyPricingComponent } from './property-pricing.component';

describe('PropertyPricingComponent', () => {
  let component: PropertyPricingComponent;
  let fixture: ComponentFixture<PropertyPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyPricingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
