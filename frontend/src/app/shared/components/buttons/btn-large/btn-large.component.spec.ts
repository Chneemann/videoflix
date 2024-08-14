import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnLargeComponent } from './btn-large.component';

describe('BtnLargeComponent', () => {
  let component: BtnLargeComponent;
  let fixture: ComponentFixture<BtnLargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnLargeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BtnLargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
