import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SSOSamlComponent } from './ssosaml.component';

describe('SSOSamlComponent', () => {
  let component: SSOSamlComponent;
  let fixture: ComponentFixture<SSOSamlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SSOSamlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SSOSamlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
