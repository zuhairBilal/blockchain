import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqtokenbarComponent } from './reqtokenbar.component';

describe('ReqtokenbarComponent', () => {
  let component: ReqtokenbarComponent;
  let fixture: ComponentFixture<ReqtokenbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqtokenbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqtokenbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
