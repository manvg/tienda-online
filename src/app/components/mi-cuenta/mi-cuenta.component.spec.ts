import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiCuentaComponent } from './mi-cuenta.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('MiCuentaComponent', () => {
  let component: MiCuentaComponent;
  let fixture: ComponentFixture<MiCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule.forRoot([]), MiCuentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('El componente MI-CUENTA se crea correctamente', () => {
    expect(component).toBeTruthy();
  });
});
