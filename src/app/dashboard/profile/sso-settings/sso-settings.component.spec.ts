import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SsoSettingsComponent } from './sso-settings.component';

describe('SsoSettingsComponent', () => {
  let component: SsoSettingsComponent;
  let fixture: ComponentFixture<SsoSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SsoSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SsoSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
