import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSignupComponent } from './modal-signup.component';

describe('ModalSignupComponent', () => {
  let component: ModalSignupComponent;
  let fixture: ComponentFixture<ModalSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
