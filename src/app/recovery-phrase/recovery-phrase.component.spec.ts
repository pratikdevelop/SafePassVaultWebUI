import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryPhraseComponent } from './recovery-phrase.component';

describe('RecoveryPhraseComponent', () => {
  let component: RecoveryPhraseComponent;
  let fixture: ComponentFixture<RecoveryPhraseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoveryPhraseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoveryPhraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
