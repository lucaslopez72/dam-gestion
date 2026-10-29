import { CabeceraComponent } from '../../components/cabecera';

import { Component, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { nombreDisponible } from '../../services/nombre-disponible';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Productos } from '../../services/productos';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { IonContent } from '@ionic/angular';
import { IonHeader } from '@ionic/angular';
import { IonTitle } from '@ionic/angular';
import { IonToolbar } from '@ionic/angular';
import { IonItem } from '@ionic/angular';
import { IonInput } from '@ionic/angular';
import { IonButton } from '@ionic/angular';
import { IonText } from '@ionic/angular';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.page.html',
  styleUrls: ['./nuevo-producto.page.scss'],
  standalone: true,
  imports: [CabeceraComponent,
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonText
  ]
})
export class NuevoProductoPage {

  private fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly productos = inject(Productos);
  private readonly router = inject(Router);
  guardando = false;
  error = '';
  guardado = false;

  formulario = this.fb.nonNullable.group({
    nombre: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(120)],
      asyncValidators: [nombreDisponible(this.productos)], updateOn: 'blur'
    }),
    precio: [0, [
      Validators.required,
      Validators.min(0.01)
    ]],
    stock: [0, [
      Validators.required,
      Validators.min(0), Validators.max(2147483647), Validators.pattern(/^\d+$/)
    ]]
  });

  constructor() {
    this.formulario.statusChanges.pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe(() => this.cdr.markForCheck());
  }

  async guardarProducto(): Promise<void> {
    if (this.guardando) return;
    this.formulario.markAllAsTouched();
    this.error = '';
    this.guardado = false;
    if (this.formulario.pending || this.formulario.invalid) return;
    this.guardando = true;
    try {
      const datos = this.formulario.getRawValue();
      await this.productos.crear({ nombre: datos.nombre, precio: Number(datos.precio), stock: Number(datos.stock) });
      this.guardado = true;
      this.formulario.reset();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'No se ha podido guardar el producto.';
    } finally { this.guardando = false; this.cdr.markForCheck(); }
    if (this.guardado) await this.router.navigateByUrl('/productos');
  }
}
