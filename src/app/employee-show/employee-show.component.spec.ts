import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeShowComponent } from './employee-show.component';

describe('EmployeeShowComponent', () => {
  let component: EmployeeShowComponent;
  let fixture: ComponentFixture<EmployeeShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
