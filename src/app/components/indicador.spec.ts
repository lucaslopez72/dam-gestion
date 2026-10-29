import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { IndicadorComponent } from './indicador';
describe('IndicadorComponent', () => {
 it('expone el estado activo y notifica la pulsación al padre', async () => {
  await TestBed.configureTestingModule({ imports: [IndicadorComponent] }).compileComponents();
  const fixture = TestBed.createComponent(IndicadorComponent);
  fixture.componentRef.setInput('titulo','Stock bajo');
  fixture.componentRef.setInput('valor','2');
  fixture.componentRef.setInput('activo',true);
  fixture.detectChanges();
  let eventos = 0;
  fixture.componentInstance.activar.subscribe(() => eventos++);
  const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
  expect(button.getAttribute('aria-pressed')).toBe('true');
  expect(button.textContent).toContain('Stock bajo');
  button.click();
  expect(eventos).toBe(1);
 });
});
