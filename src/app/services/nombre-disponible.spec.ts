import { FormControl } from '@angular/forms';
import { nombreDisponible } from './nombre-disponible';
import { Productos } from './productos';

describe('Validación asíncrona del nombre', () => {
  it('excluye el producto editado de la búsqueda de duplicados', async () => {
    const existeNombre = vi.fn().mockResolvedValue(false);
    const validar = nombreDisponible({ existeNombre } as unknown as Productos, () => 3);
    expect(await validar(new FormControl('Portatil Lenovo'))).toBeNull();
    expect(existeNombre).toHaveBeenCalledWith('Portatil Lenovo', 3);
  });
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
