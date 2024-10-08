import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordGenratorComponent } from './password-genrator.component';

describe('PasswordGenratorComponent', () => {
  let component: PasswordGenratorComponent;
  let fixture: ComponentFixture<PasswordGenratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordGenratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordGenratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
