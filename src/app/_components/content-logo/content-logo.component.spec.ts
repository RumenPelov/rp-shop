import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentLogoComponent } from './content-logo.component';

describe('ContentLogoComponent', () => {
  let component: ContentLogoComponent;
  let fixture: ComponentFixture<ContentLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
