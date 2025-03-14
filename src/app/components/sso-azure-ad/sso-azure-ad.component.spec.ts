import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SsoAzureAdComponent } from './sso-azure-ad.component';

describe('SsoAzureAdComponent', () => {
  let component: SsoAzureAdComponent;
  let fixture: ComponentFixture<SsoAzureAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SsoAzureAdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SsoAzureAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
