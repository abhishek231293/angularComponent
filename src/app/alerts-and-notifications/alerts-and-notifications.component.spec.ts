import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsAndNotificationsComponent } from './alerts-and-notifications.component';

describe('AlertsAndNotificationsComponent', () => {
  let component: AlertsAndNotificationsComponent;
  let fixture: ComponentFixture<AlertsAndNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertsAndNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsAndNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
