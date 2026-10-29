import { provideRouter } from '@angular/router';
import { Productos } from '../../services/productos';
import { Auth } from '../../services/auth';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NuevoProductoPage } from './nuevo-producto.page';

describe('Nuevo producto conectado a Supabase', () => {
  it('guarda mediante el servicio y navega al catálogo', async () => {
    const crear = vi.fn().mockResolvedValue(undefined);
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: Productos, useValue: { crear, existeNombre: async () => false } }] });
    const { Router } = await import('@angular/router');
    const navegar = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    const fixture = TestBed.createComponent(NuevoProductoPage);
    fixture.componentInstance.formulario.setValue({ nombre: 'Producto de prueba', precio: 10, stock: 2 });
    await fixture.whenStable();
    await fixture.componentInstance.guardarProducto();
    expect(crear).toHaveBeenCalledWith({ nombre: 'Producto de prueba', precio: 10, stock: 2 });
    expect(navegar).toHaveBeenCalledWith('/productos');
    expect(fixture.componentInstance.guardando).toBe(false);
  });
});
