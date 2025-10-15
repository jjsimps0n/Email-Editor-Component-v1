import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailBuilder } from './email-builder';

describe('EmailBuilder', () => {
  let component: EmailBuilder;
  let fixture: ComponentFixture<EmailBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailBuilder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
