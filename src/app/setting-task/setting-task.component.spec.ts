import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingTaskComponent } from './setting-task.component';

describe('SettingTaskComponent', () => {
  let component: SettingTaskComponent;
  let fixture: ComponentFixture<SettingTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
