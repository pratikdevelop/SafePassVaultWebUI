import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SSOOAuth2Component } from './ssooauth2.component';

describe('SSOOAuth2Component', () => {
  let component: SSOOAuth2Component;
  let fixture: ComponentFixture<SSOOAuth2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SSOOAuth2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SSOOAuth2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
