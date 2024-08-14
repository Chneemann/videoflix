import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnSmallComponent } from './btn-small.component';

describe('BtnSmallComponent', () => {
  let component: BtnSmallComponent;
  let fixture: ComponentFixture<BtnSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnSmallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BtnSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
