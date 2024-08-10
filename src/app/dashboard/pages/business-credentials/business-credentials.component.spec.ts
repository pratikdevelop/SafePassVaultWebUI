import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCredentialsComponent } from './business-credentials.component';

describe('BusinessCredentialsComponent', () => {
  let component: BusinessCredentialsComponent;
  let fixture: ComponentFixture<BusinessCredentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessCredentialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
