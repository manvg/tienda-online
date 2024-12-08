import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TartaletasComponent } from './tartaletas.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('TartaletasComponent', () => {
  let component: TartaletasComponent;
  let fixture: ComponentFixture<TartaletasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule.forRoot([]), TartaletasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TartaletasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('El componente TARTALETAS se crea correctamente', () => {
    expect(component).toBeTruthy();
  });
});
