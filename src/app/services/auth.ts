import { Injectable, inject, signal } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { Supabase } from './supabase';
export type Rol = 'admin' | 'usuario';
export interface Sesion { nombre: string; email: string; rol: Rol; }
@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly client = inject(Supabase).client;
  private readonly actual = signal<Sesion | null>(null);
  readonly sesion = this.actual.asReadonly();
  readonly lista: Promise<void>;
  constructor() {
    this.client.auth.onAuthStateChange((_event, session) => this.actualizar(session?.user ?? null));
    this.lista = this.restaurar();
  }
  private async restaurar(): Promise<void> {
    try {
      const { data, error } = await this.client.auth.getUser();
      this.actualizar(error ? null : data.user);
    } catch {
      this.actualizar(null);
    }
  }
  private actualizar(user: User | null): void {
    const rol = user?.app_metadata?.['rol'];
    this.actual.set(user && !user.is_anonymous && (rol === 'admin' || rol === 'usuario')
      ? { nombre: rol === 'admin' ? 'Administrador' : 'Usuario', email: user.email ?? '', rol } : null);
  }
  async login(email: string, password: string): Promise<boolean> {
    await this.lista;
    const { data, error } = await this.client.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error) {
      this.actual.set(null);
      if (error.code === 'invalid_credentials') return false;
      if (error.code === 'email_not_confirmed') {
        throw new Error('Confirma tu correo electrónico antes de acceder.');
      }
      throw new Error('No se ha podido conectar con Supabase. Inténtalo de nuevo en unos segundos.');
    }
    this.actualizar(data.user);
    if (!this.sesion()) {
      await this.client.auth.signOut({ scope: 'local' });
      throw new Error('La cuenta no tiene un rol asignado. Contacta con el administrador.');
    }
    return true;
  }
  async logout(): Promise<void> {
    const { error } = await this.client.auth.signOut({ scope: 'local' });
    if (error) throw error;
    this.actual.set(null);
  }
}
