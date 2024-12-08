import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TortasComponent } from './tortas.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('TortasComponent', () => {
  let component: TortasComponent;
  let fixture: ComponentFixture<TortasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule.forRoot([]), TortasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TortasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('El componente TORTAS se crea correctamente', () => {
    expect(component).toBeTruthy();
  });
});
