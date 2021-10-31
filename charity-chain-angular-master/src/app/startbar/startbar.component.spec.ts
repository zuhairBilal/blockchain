import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartbarComponent } from './startbar.component';

describe('StartbarComponent', () => {
  let component: StartbarComponent;
  let fixture: ComponentFixture<StartbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
