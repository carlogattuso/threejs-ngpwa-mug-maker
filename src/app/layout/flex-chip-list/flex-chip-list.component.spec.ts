import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FlexChipListComponent} from './flex-chip-list.component';

describe('ChipListLayoutComponent', () => {
  let component: FlexChipListComponent;
  let fixture: ComponentFixture<FlexChipListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlexChipListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FlexChipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
