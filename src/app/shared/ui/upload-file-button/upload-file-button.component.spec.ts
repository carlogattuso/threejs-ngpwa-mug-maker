import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileButtonComponent } from './upload-file-button.component';

describe('UploadFileButtonComponent', () => {
  let component: UploadFileButtonComponent;
  let fixture: ComponentFixture<UploadFileButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadFileButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadFileButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
