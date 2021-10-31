import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterbarComponent } from './registerbar.component';

describe('RegisterbarComponent', () => {
  let component: RegisterbarComponent;
  let fixture: ComponentFixture<RegisterbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
