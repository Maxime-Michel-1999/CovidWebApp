import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryCovidComponent } from './country-covid.component';

describe('CountryCovidComponent', () => {
  let component: CountryCovidComponent;
  let fixture: ComponentFixture<CountryCovidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryCovidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryCovidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
