import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsCreationDialogComponent } from './tags-creation-dialog.component';

describe('TagsCreationDialogComponent', () => {
  let component: TagsCreationDialogComponent;
  let fixture: ComponentFixture<TagsCreationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagsCreationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagsCreationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
