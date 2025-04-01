import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnsocialComponent } from './btnsocial.component';

describe('BtnsocialComponent', () => {
  let component: BtnsocialComponent;
  let fixture: ComponentFixture<BtnsocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnsocialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnsocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
