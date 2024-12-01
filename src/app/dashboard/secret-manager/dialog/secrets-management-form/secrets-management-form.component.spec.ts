import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretsManagementFormComponent } from './secrets-management-form.component';

describe('SecretsManagementFormComponent', () => {
  let component: SecretsManagementFormComponent;
  let fixture: ComponentFixture<SecretsManagementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecretsManagementFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecretsManagementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
