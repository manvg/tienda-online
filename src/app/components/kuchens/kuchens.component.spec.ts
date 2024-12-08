import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KuchensComponent } from './kuchens.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('KuchensComponent', () => {
  let component: KuchensComponent;
  let fixture: ComponentFixture<KuchensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule.forRoot([]), KuchensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KuchensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('El componente KUCHENS se crea correctamente', () => {
    expect(component).toBeTruthy();
  });
});
