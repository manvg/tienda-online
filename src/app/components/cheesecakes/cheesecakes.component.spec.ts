import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheesecakesComponent } from './cheesecakes.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('CheesecakesComponent', () => {
  let component: CheesecakesComponent;
  let fixture: ComponentFixture<CheesecakesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule.forRoot([]), CheesecakesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheesecakesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('El componente CHEESECAKES se crea correctamente', () => {
    expect(component).toBeTruthy();
  });
});
