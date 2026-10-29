import { Component, input, output, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../services/productos';
@Component({
 selector: 'app-tabla-productos', imports: [CommonModule], changeDetection: ChangeDetectionStrategy.OnPush,
 template: `<div class="table-tools"><label>Buscar producto <input #campo type="search" placeholder="Nombre del producto…" [value]="busqueda()" (input)="buscar($any($event.target).value)" /></label>
 @if(busqueda()){<button type="button" (click)="buscar('');campo.focus()">Limpiar búsqueda</button>}</div>
 <p role="status">{{ filtrados().length }} productos</p>
 <div class="scroll"><table><caption>Catálogo de productos</caption><thead><tr><th scope="col">Nombre</th><th scope="col">Precio</th><th scope="col">Stock</th>@if(editable()){<th scope="col">Acciones</th>}</tr></thead>
 <tbody>@for(p of filtrados(); track p.id){<tr><th scope="row"><button type="button" (click)="seleccion.emit(p)"><span class="product-icon" aria-hidden="true">▣</span>{{ p.nombre }}</button></th><td>{{ p.precio | currency:'EUR' }}</td><td><span [class.low]="p.stock<=5" [class.out]="p.stock===0" class="stock">{{ p.stock }} <small>{{p.stock===0?'· Agotado':p.stock<=5?'· Bajo':'· Disponible'}}</small></span></td>@if(editable()){<td><button type="button" [attr.aria-label]="'Editar ' + p.nombre" (click)="editar.emit(p)">Editar</button></td>}</tr>}
 @empty {<tr><td [attr.colspan]="editable() ? 4 : 3">No hay productos que coincidan.</td></tr>}</tbody></table></div>`,
 styles: [`:host{display:block}.table-tools{display:flex;gap:1rem;flex-wrap:wrap}label{display:flex;gap:1rem;align-items:center;flex-wrap:wrap;font-size:.8rem;font-weight:600}input{padding:.7rem;border:1px solid var(--line);border-radius:var(--radius-control);background:var(--surface);color:var(--ink);font:inherit;min-height:44px;max-width:100%}.scroll{overflow:auto}table{width:100%;border-collapse:collapse;text-align:left;font-size:.94rem;font-variant-numeric:tabular-nums}caption{text-align:left;padding:1rem 0;color:var(--muted);font-size:.8rem}th,td{padding:1rem;border-bottom:1px solid var(--line);white-space:nowrap}thead th{font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);background:var(--ion-background-color);font-weight:650}tbody tr:hover{background:#f6f9fb}tbody th{font-weight:600}button{font:inherit;text-align:left;background:transparent;color:var(--ion-color-primary);border:0;padding:.5rem 0;cursor:pointer;min-height:44px}.product-icon{display:inline-grid;place-items:center;width:32px;height:32px;background:#e7eff2;border-radius:6px;margin-right:12px;color:var(--ion-color-primary)}.stock{background:#e9f2ef;color:#25604e;border-radius:5px;padding:6px 10px;font-size:.8rem}.stock.low{background:#fff0d9;color:var(--warning)}small{font-size:.7rem}p[role=status]{color:var(--muted);font-size:.8rem}button:focus-visible,input:focus-visible{outline:3px solid var(--ion-color-primary);outline-offset:3px} @media(max-width:600px){.scroll{overflow:visible}table,tbody{display:block}thead{position:absolute;width:1px;height:1px;clip-path:inset(50%);overflow:hidden}tbody{display:grid;gap:12px}tbody tr{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--line);border-radius:8px;overflow:hidden}tbody th{grid-column:1/-1}th,td{white-space:normal;padding:10px 12px}td{font-size:.85rem}td::before{display:block;font-size:.65rem;color:var(--muted);margin-bottom:8px}td:first-of-type::before{content:"Precio"}td:nth-of-type(2)::before{content:"Stock"}td:nth-of-type(3){grid-column:1/-1}td[colspan]{grid-column:1/-1}td[colspan]::before{content:none}.stock{display:inline-block}label{gap:.5rem}input{width:100%}}`]
})
export class TablaProductosComponent {
 readonly productos = input.required<readonly Producto[]>();
 readonly editable = input(false);
 readonly editar = output<Producto>();
 readonly seleccion = output<Producto>();
 readonly filtroCambio = output<string>();
 readonly busqueda = signal('');
 readonly filtrados = computed(() => this.productos().filter(p => p.nombre.toLocaleLowerCase('es').includes(this.busqueda().toLocaleLowerCase('es').trim())));
 buscar(texto: string): void { this.busqueda.set(texto); this.filtroCambio.emit(texto); }
}
