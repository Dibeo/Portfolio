import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bio } from './bio';

describe('Bio', () => {
  let component: Bio;
  let fixture: ComponentFixture<Bio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
