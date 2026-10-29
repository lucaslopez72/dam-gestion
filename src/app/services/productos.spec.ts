import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Productos } from './productos';
import { Supabase } from './supabase';
import { Auth } from './auth';

describe('Edición de productos', () => {
  const producto = { nombre: 'Lenovo actualizado', precio: 550, stock: 6 };
  function preparar(rol = 'admin', fila: object | null = { id: 3 }) {
    const consulta = { eq: vi.fn().mockReturnThis(), select: vi.fn().mockReturnThis(), maybeSingle: vi.fn().mockResolvedValue({ data: fila, error: null }) };
    const update = vi.fn().mockReturnValue(consulta);
    const from = vi.fn().mockReturnValue({ update });
    TestBed.configureTestingModule({ providers: [{ provide: Supabase, useValue: { client: { from } } }, { provide: Auth, useValue: { lista: Promise.resolve(), sesion: signal({ rol }) } }] });
    const servicio = TestBed.inject(Productos);
    const duplicado = vi.spyOn(servicio, 'existeNombre').mockResolvedValue(false);
    return { servicio, from, update, consulta, duplicado };
  }
  it('actualiza solo el ID solicitado y excluye ese ID al validar el nombre', async () => {
    const { servicio, update, consulta, duplicado } = preparar();
    await servicio.actualizar(3, producto);
    expect(update).toHaveBeenCalledWith(producto);
    expect(consulta.eq).toHaveBeenCalledWith('id', 3);
    expect(duplicado).toHaveBeenCalledWith(producto.nombre, 3);
  });
  it('rechaza un usuario estándar antes de enviar la actualización', async () => {
    const { servicio, from } = preparar('usuario');
    await expect(servicio.actualizar(3, producto)).rejects.toThrow('Solo un administrador');
    expect(from).not.toHaveBeenCalled();
  });
  it('no anuncia éxito cuando RLS o un registro desaparecido devuelve cero filas', async () => {
    const { servicio } = preparar('admin', null);
    await expect(servicio.actualizar(3, producto)).rejects.toThrow('No se ha actualizado');
  });
  it('rechaza duplicados y stock fraccionario sin escribir', async () => {
    const { servicio, update, duplicado } = preparar();
    duplicado.mockResolvedValue(true);
    await expect(servicio.actualizar(3, producto)).rejects.toThrow('Ya existe otro');
    await expect(servicio.actualizar(3, { ...producto, stock: 1.5 })).rejects.toThrow('Revisa');
    expect(update).not.toHaveBeenCalled();
  });
});
