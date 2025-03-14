import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfaSettingComponent } from './mfa-setting.component';

describe('MfaSettingComponent', () => {
  let component: MfaSettingComponent;
  let fixture: ComponentFixture<MfaSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MfaSettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MfaSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
