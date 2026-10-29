import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
@Component({
 selector: 'app-indicador', changeDetection: ChangeDetectionStrategy.OnPush,
 template: `<button type="button" (click)="activar.emit()" [attr.aria-pressed]="activo()"><span>{{ titulo() }}</span><strong>{{ valor() }}</strong><small>{{ detalle() }}</small></button>`,
 styles: [`:host{display:block}button{display:flex;flex-direction:column;gap:.75rem;text-align:left;width:100%;height:100%;min-height:166px;padding:1.4rem;background:var(--surface);color:var(--ink);border:1px solid var(--line);border-top:3px solid var(--line);border-radius:var(--radius-surface);cursor:pointer;font:inherit;transition:border-color .16s,background .16s}button:hover{background:#f8fbfc;border-color:var(--ion-color-primary)}button[aria-pressed=true]{border-top-color:var(--ion-color-primary);background:#f5fafb}span{font-size:.82rem;color:var(--muted);font-weight:600}strong{font-family:var(--font-display);font-variant-numeric:tabular-nums;font-size:clamp(1.7rem,2.6vw,2.5rem);font-weight:650;letter-spacing:-.04em}small{line-height:1.5;font-size:.7rem;color:var(--muted)}button:focus-visible{outline:3px solid var(--ion-color-primary);outline-offset:3px}`]
})
export class IndicadorComponent {
 readonly titulo = input.required<string>();
 readonly valor = input.required<string>();
 readonly detalle = input('');
 readonly activo = input(false);
 readonly activar = output<void>();
}
