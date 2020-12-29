import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldCovidComponent } from './world-covid.component';

describe('WorldCovidComponent', () => {
  let component: WorldCovidComponent;
  let fixture: ComponentFixture<WorldCovidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldCovidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldCovidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
