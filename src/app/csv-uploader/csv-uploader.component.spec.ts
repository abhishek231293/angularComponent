import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvUploaderComponent } from './csv-uploader.component';

describe('CsvUploaderComponent', () => {
  let component: CsvUploaderComponent;
  let fixture: ComponentFixture<CsvUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
