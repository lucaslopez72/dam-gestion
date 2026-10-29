import { TestBed } from '@angular/core/testing';
import { generarCSV, Informes } from './informes';
import { Producto } from './productos';
const producto: Producto = { id: 3, nombre: 'Portatil Lenovo', precio: 500, stock: 4, created_at: null };

describe('Informes tabulados', () => {
  it('exporta filas, decimales, caracteres especiales y evita fórmulas CSV', () => {
    const csv = generarCSV([producto, { ...producto, id: 4, nombre: '=SUM(1;2) "prueba"' }]);
    expect(csv).toContain('"Portatil Lenovo";"500";"4";"2000"');
    expect(csv).toContain('"\'=SUM(1;2) ""prueba"""');
    expect(csv.startsWith('\uFEFF')).toBe(true);
  });

  it('genera un PDF paginado con todos los registros y su cabecera', async () => {
    const filas = Array.from({ length: 65 }, (_, i) => ({ ...producto, id: i, nombre: 'Producto ' + i }));
    const pdf = await TestBed.inject(Informes).crearPDF(filas, 'Todo el catálogo');
    expect(pdf.getNumberOfPages()).toBeGreaterThan(1);
    const texto = pdf.output();
    expect(texto).toContain('Producto 64');
    expect(texto).toContain('Informe de inventario');
    expect(texto.startsWith('%PDF')).toBe(true);
  });
});
