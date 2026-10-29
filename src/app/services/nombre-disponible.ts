import { AsyncValidatorFn } from '@angular/forms';
import { Productos } from './productos';

/** Validador remoto; bloquea el envío si falla la consulta, sin confundirlo con un nombre libre. */
export function nombreDisponible(productos: Productos): AsyncValidatorFn {
  return async control => {
    const nombre = String(control.value ?? '').trim();
    if (nombre.length < 3) return null;
    try {
      return await productos.existeNombre(nombre) ? { nombreExistente: true } : null;
    } catch {
      return { validacionNoDisponible: true };
    }
  };
}
