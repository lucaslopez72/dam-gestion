import { provideRouter } from '@angular/router';
import { Productos } from '../../services/productos';
import { Auth } from '../../services/auth';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPage } from './dashboard.page';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: Productos, useValue: { listar: async () => [], crear: async () => undefined } }, { provide: Auth, useValue: { sesion: signal({ email: 'prueba@example.com', rol: 'admin' }), logout: async () => undefined } }] });
    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
