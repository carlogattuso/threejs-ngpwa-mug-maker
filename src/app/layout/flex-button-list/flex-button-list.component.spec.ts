import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexButtonListComponent } from './flex-button-list.component';

describe('FlexButtonListComponent', () => {
  let component: FlexButtonListComponent;
  let fixture: ComponentFixture<FlexButtonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlexButtonListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlexButtonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
