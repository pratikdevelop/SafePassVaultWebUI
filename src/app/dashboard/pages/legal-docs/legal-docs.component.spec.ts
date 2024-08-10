import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalDocsComponent } from './legal-docs.component';

describe('LegalDocsComponent', () => {
  let component: LegalDocsComponent;
  let fixture: ComponentFixture<LegalDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalDocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
