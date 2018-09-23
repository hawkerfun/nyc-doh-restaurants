import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtlControlComponent } from './etl-control.component';

describe('EtlControlComponent', () => {
  let component: EtlControlComponent;
  let fixture: ComponentFixture<EtlControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtlControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtlControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
