import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonMainComponent } from './button-main.component';

describe('ButtonMainComponent', () => {
  let component: ButtonMainComponent;
  let fixture: ComponentFixture<ButtonMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
