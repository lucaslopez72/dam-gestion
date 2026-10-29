export interface DatoInventario { precio: number; stock: number; }
export function resumen(productos: readonly DatoInventario[]) {
 return productos.reduce((r,p) => ({ referencias:r.referencias+1, unidades:r.unidades+Number(p.stock), valor:r.valor+Number(p.precio)*Number(p.stock), bajos:r.bajos+(p.stock<=5?1:0) }),{referencias:0,unidades:0,valor:0,bajos:0});
}
