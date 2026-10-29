import { Injectable, inject } from '@angular/core';
import { Supabase } from './supabase';
import { Auth } from './auth';
export interface Producto { id: number; nombre: string; precio: number; stock: number; created_at: string | null; }
export type NuevoProducto = Pick<Producto, 'nombre' | 'precio' | 'stock'>;
@Injectable({ providedIn: 'root' })
export class Productos {
  private readonly client = inject(Supabase).client;
  private readonly auth = inject(Auth);
  /** Consulta asíncrona utilizada por el validador del alta; RLS sigue controlando el acceso. */
  async existeNombre(nombre: string): Promise<boolean> {
    await this.auth.lista;
    if (!this.auth.sesion()) throw new Error('Inicia sesión para validar el producto.');
    const literal = nombre.trim().replace(/[\\%_]/g, caracter => '\\' + caracter);
    const { data, error } = await this.client.from('productos').select('id').ilike('nombre', literal).limit(1);
    if (error) throw new Error('No se ha podido comprobar el nombre.');
    return !!data?.length;
  }
  async listar(): Promise<Producto[]> {
    await this.auth.lista;
    if (!this.auth.sesion()) throw new Error('Inicia sesión con una cuenta autorizada.');
    const { data, error } = await this.client.from('productos').select('id,nombre,precio,stock,created_at').order('id', { ascending: false });
    if (error) throw new Error('No se han podido cargar los productos. Comprueba la conexión y tus permisos.');
    return data ?? [];
  }
  async crear(producto: NuevoProducto): Promise<void> {
    await this.auth.lista;
    if (this.auth.sesion()?.rol !== 'admin') throw new Error('Solo un administrador puede guardar productos.');
    const nombre = producto.nombre.trim();
    if (nombre.length < 3 || nombre.length > 120 || !Number.isFinite(producto.precio) || producto.precio < 0.01 ||
      !Number.isInteger(producto.stock) || producto.stock < 0 || producto.stock > 2147483647)
      throw new Error('Revisa el nombre, el precio y el stock entero no negativo.');
    const { error } = await this.client.from('productos').insert({ ...producto, nombre });
    if (error) throw new Error('No se ha confirmado el guardado. Comprueba tu conexión y el listado antes de reintentarlo.');
  }
}
