import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MugComponent} from './mug.component';

describe('MugComponent', () => {
  let component: MugComponent;
  let fixture: ComponentFixture<MugComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MugComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
