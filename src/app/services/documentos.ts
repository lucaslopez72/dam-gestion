import { Injectable } from '@angular/core';
import { Observable, timer, switchMap } from 'rxjs';

export interface DocumentoOperativo { id: string; titulo: string; mensaje: string; tipo: string; }

/** Segunda fuente documental simulada: JSON asíncrono con instantáneas cada diez segundos.
 * No es Firestore ni escribe datos de negocio. La simulación se identifica en la interfaz.
 */
@Injectable({ providedIn: 'root' })
export class Documentos {
  async cargar(): Promise<DocumentoOperativo[]> {
    const respuesta = await fetch(new URL('assets/documentos-demo.json', document.baseURI), { signal: AbortSignal.timeout(12000), cache: 'no-store' });
    if (!respuesta.ok) throw new Error('No se ha podido cargar la fuente documental simulada.');
    const datos: unknown = await respuesta.json();
    if (!Array.isArray(datos) || !datos.every(d => d && ['id','titulo','mensaje','tipo'].every(k => typeof d[k] === 'string'))) {
      throw new Error('El formato de la fuente documental no es válido.');
    }
    return datos;
  }

  observar(): Observable<DocumentoOperativo[]> {
    return timer(10000, 10000).pipe(switchMap(() => this.cargar()));
  }
}
