import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndexComponent } from './index.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule.forRoot([]), IndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('El componente INDEX se crea correctamente', () => {
    expect(component).toBeTruthy();
  });
});
