import { Injectable } from '@angular/core';
import { Producto } from './productos';
import { resumen } from '../pages/dashboard/metricas';

/** Escapa CSV y neutraliza fórmulas al abrir texto controlado por usuarios en una hoja de cálculo. */
export function celdaCSV(valor: string | number): string {
  let texto = String(valor);
  if (typeof valor === 'string' && /^[\s]*[=+\-@\t\r\n]/.test(texto)) texto = "'" + texto;
  return '"' + texto.replace(/"/g, '""') + '"';
}

export function generarCSV(productos: readonly Producto[]): string {
  const filas: (string | number)[][] = [['ID','Nombre','Precio (EUR)','Stock','Valor (EUR)'],
    ...productos.map(p => [p.id, p.nombre, p.precio, p.stock, Math.round(p.precio * p.stock * 100) / 100])];
  return '\uFEFF' + filas.map(f => f.map(celdaCSV).join(';')).join('\r\n') + '\r\n';
}

/** Informes del catálogo filtrado: PDF paginado y CSV UTF-8, generados en el navegador. */
@Injectable({ providedIn: 'root' })
export class Informes {
  csv(productos: readonly Producto[]): void {
    const url = URL.createObjectURL(new Blob([generarCSV(productos)], { type: 'text/csv;charset=utf-8' }));
    const enlace = document.createElement('a');
    enlace.href = url; enlace.download = 'inventario.csv'; enlace.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async crearPDF(productos: readonly Producto[], filtro: string) {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const totales = resumen(productos);
    const euro = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' EUR';
    doc.setProperties({ title: 'DAM Gestión - Informe de inventario', author: 'DAM Gestión' });
    doc.setFontSize(19); doc.text('Informe de inventario', 15, 20);
    doc.setFontSize(10); doc.text('DAM Gestión · ' + new Date().toLocaleString('es-ES'), 15, 29);
    const lineasFiltro: string[] = doc.splitTextToSize('Filtro: ' + filtro, 180);
    doc.text(lineasFiltro, 15, 36);
    const resumenY = 36 + lineasFiltro.length * 5 + 2;
    doc.text(`${totales.referencias} referencias · ${totales.unidades} unidades · ${euro(totales.valor)}`, 15, resumenY);
    let y = resumenY + 12;
    const cabecera = () => {
      doc.setFillColor(35, 58, 92); doc.rect(15, y - 6, 180, 10, 'F');
      doc.setTextColor(255); doc.setFontSize(10);
      doc.text('Producto', 18, y); doc.text('Precio', 112, y); doc.text('Stock', 145, y); doc.text('Valor', 163, y);
      doc.setTextColor(25); y += 13;
    };
    cabecera();
    for (const p of productos) {
      const lineas: string[] = doc.splitTextToSize(p.nombre, 87);
      // Trocea nombres largos para que incluso un registro ocupe varias páginas sin solaparse.
      for (let inicio = 0; inicio < lineas.length; inicio += 18) {
        const fragmento = lineas.slice(inicio, inicio + 18);
        const alto = Math.max(10, fragmento.length * 5 + 4);
        if (y + alto > 276) { doc.addPage(); y = 22; cabecera(); }
        doc.text(fragmento, 18, y);
        if (inicio === 0) {
          doc.text(euro(p.precio), 112, y); doc.text(String(p.stock), 145, y); doc.text(euro(p.precio * p.stock), 163, y);
        }
        y += alto; doc.setDrawColor(210); doc.line(15, y - 5, 195, y - 5);
      }
    }
    if (!productos.length) doc.text('No hay productos para el filtro seleccionado.', 18, y);
    const paginas = doc.getNumberOfPages();
    for (let i = 1; i <= paginas; i++) { doc.setPage(i); doc.setFontSize(9); doc.text(`Página ${i} de ${paginas}`, 165, 288); }
    return doc;
  }

  async pdf(productos: readonly Producto[], filtro: string): Promise<void> {
    (await this.crearPDF(productos, filtro)).save('inventario.pdf');
  }
}
