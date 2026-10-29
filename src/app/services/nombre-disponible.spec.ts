import { FormControl } from '@angular/forms';
import { nombreDisponible } from './nombre-disponible';
import { Productos } from './productos';

describe('Validación asíncrona del nombre', () => {
  it('rechaza duplicados y bloquea la validación si el servicio falla', async () => {
    const existeNombre = vi.fn().mockResolvedValue(true);
    const validar = nombreDisponible({ existeNombre } as unknown as Productos);
    const control = new FormControl('Portatil Lenovo');
    expect(await validar(control)).toEqual({ nombreExistente: true });
    existeNombre.mockRejectedValue(new Error('Sin red'));
    expect(await validar(control)).toEqual({ validacionNoDisponible: true });
    existeNombre.mockResolvedValue(false);
    expect(await validar(control)).toBeNull();
  });
});
