import { describe, it, expect } from 'vitest';
import { resumen } from './metricas';
describe('Métricas del inventario', () => {
 it('devuelve ceros para un catálogo vacío', () => {
  expect(resumen([])).toEqual({referencias:0,unidades:0,valor:0,bajos:0});
 });
 it('calcula el valor usando precio por stock e incluye el umbral de cinco unidades', () => {
  expect(resumen([{precio:500,stock:4},{precio:10,stock:5},{precio:1.5,stock:6},{precio:100,stock:0}]))
   .toEqual({referencias:4,unidades:15,valor:2059,bajos:3});
 });
});
