import { CabeceraComponent } from '../../components/cabecera';
import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonButton, IonText, IonSpinner } from '@ionic/angular';
import { Productos, Producto } from '../../services/productos';
import { Auth } from '../../services/auth';
import { TablaProductosComponent } from '../../components/tabla-productos';
@Component({
  selector: 'app-productos', templateUrl: './productos.page.html', styleUrls: ['./productos.page.scss'],
  imports: [CabeceraComponent,TablaProductosComponent, CommonModule, RouterLink, IonContent, IonButton, IonText, IonSpinner]
})
export class ProductosPage {
  private readonly servicio = inject(Productos);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly auth = inject(Auth);
  private readonly router = inject(Router);
  seleccionado: Producto | null = null;
  productos: Producto[] = [];
  cargando = false;
  error = '';
  ionViewWillEnter(): void { void this.cargar(); }
  async cargar(): Promise<void> {
    if (this.cargando) return;
    this.cargando = true; this.error = ''; this.productos = []; this.seleccionado = null;
    try { this.productos = await this.servicio.listar(); }
    catch (error) { this.error = error instanceof Error ? error.message : 'No se han podido cargar los productos.'; }
    finally { this.cargando = false; this.cdr.markForCheck(); }
  }
  async salir(): Promise<void> {
    try {
      await this.auth.logout(); this.productos = [];
      await this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch { this.error = 'No se ha podido cerrar la sesión. Inténtalo de nuevo.'; this.cdr.markForCheck(); }
  }
}
