import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { TablaProductosComponent } from './tabla-productos';

describe('TablaProductosComponent', () => {
 it('filtra sin distinguir mayúsculas, conserva los datos y emite la selección', async () => {
  await TestBed.configureTestingModule({ imports: [TablaProductosComponent] }).compileComponents();
  const fixture = TestBed.createComponent(TablaProductosComponent);
  const datos = [
   { id: 1, nombre: 'Portatil Lenovo', precio: 500, stock: 4, created_at: null },
   { id: 2, nombre: 'Monitor', precio: 120, stock: 8, created_at: null }
  ];
  fixture.componentRef.setInput('productos', datos);
  fixture.detectChanges();
  let filtro = '';
  let elegido = 0;
  fixture.componentInstance.filtroCambio.subscribe(v => filtro = v);
  fixture.componentInstance.seleccion.subscribe(p => elegido = p.id);
  const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
  input.value = ' LENOVO ';
  input.dispatchEvent(new Event('input'));
  fixture.detectChanges();
  expect(filtro).toBe(' LENOVO ');
  expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(1);
  expect(fixture.nativeElement.querySelector('tbody').textContent).toContain('Portatil Lenovo');
  fixture.nativeElement.querySelector('tbody button').click();
  expect(elegido).toBe(1);
  expect(datos.length).toBe(2);
  input.value = 'inexistente';
  input.dispatchEvent(new Event('input'));
  fixture.detectChanges();
  expect(fixture.nativeElement.textContent).toContain('No hay productos que coincidan.');
 });
});
