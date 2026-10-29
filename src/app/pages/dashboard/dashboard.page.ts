import { CabeceraComponent } from '../../components/cabecera';
import { Component, inject, signal, computed, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Documentos, DocumentoOperativo } from '../../services/documentos';
import { Informes } from '../../services/informes';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton, IonSpinner } from '@ionic/angular';
import { Productos, Producto } from '../../services/productos';
import { TablaProductosComponent } from '../../components/tabla-productos';
import { IndicadorComponent } from '../../components/indicador';
import { resumen } from './metricas';
@Component({
 selector:'app-dashboard', templateUrl:'./dashboard.page.html', styleUrls:['./dashboard.page.scss'],
 imports: [CabeceraComponent,FormsModule,CommonModule,IonContent,IonButton,IonSpinner,TablaProductosComponent,IndicadorComponent]
})
export class DashboardPage implements OnDestroy {
 private readonly servicio=inject(Productos);
 private readonly fuenteDocumental=inject(Documentos);
 private readonly informes=inject(Informes);
 private actualizaciones?:Subscription;
 private visible=false;
 readonly documentos=signal<DocumentoOperativo[]>([]);
 readonly errorDocumentos=signal('');
 readonly ultimaActualizacion=signal('');
 readonly exportando=signal(false);
 readonly avisoExportacion=signal('');
 filtroNombre='';
 readonly productos=signal<Producto[]>([]);
 readonly cargando=signal(false);
 readonly error=signal('');
 readonly bajos=signal(false);
 readonly seleccionado=signal<Producto|null>(null);
 readonly metricas=computed(()=>resumen(this.productos()));
 readonly nombre=signal('');
 readonly visibles=computed(()=>this.productos().filter(p=>(!this.bajos()||p.stock<=5) && p.nombre.toLocaleLowerCase('es').includes(this.nombre().trim().toLocaleLowerCase('es'))));
 readonly grafico=computed(()=>[...this.visibles()].sort((a,b)=>b.stock-a.stock||a.nombre.localeCompare(b.nombre)).slice(0,10));
 readonly maximo=computed(()=>Math.max(1,...this.grafico().map(p=>p.stock)));
 ionViewWillEnter():void {
  this.visible=true;
  void this.cargar();
  this.iniciarActualizaciones();
 }
 private iniciarActualizaciones():void {
  this.actualizaciones?.unsubscribe();
  this.actualizaciones=this.fuenteDocumental.observar().subscribe({
   next:datos=>{this.documentos.set(datos);this.errorDocumentos.set('');this.ultimaActualizacion.set(new Date().toLocaleTimeString('es-ES',{timeZone:'Europe/Madrid'}));},
   error:()=>this.errorDocumentos.set('La simulación documental se ha detenido. Pulsa Actualizar datos para reintentar.')
  });
 }
 ionViewDidLeave():void {this.visible=false;this.actualizaciones?.unsubscribe();}
 ngOnDestroy():void {this.actualizaciones?.unsubscribe();}
 async cargar():Promise<void> {
  if(this.cargando())return;
  this.cargando.set(true);this.error.set('');this.seleccionado.set(null);
  try {
   // Las dos fuentes se consultan a la vez; un fallo documental no oculta el catálogo SQL.
   const [productos,documentos]=await Promise.all([
    this.servicio.listar(),
    this.fuenteDocumental.cargar().then(datos=>({datos,error:''})).catch(()=>({datos:[] as DocumentoOperativo[],error:'No se ha podido cargar la simulación documental.'}))
   ]);
   this.productos.set(productos);this.documentos.set(documentos.datos);this.errorDocumentos.set(documentos.error);
   this.ultimaActualizacion.set(new Date().toLocaleTimeString('es-ES',{timeZone:'Europe/Madrid'}));
  }
  catch(e){this.productos.set([]);this.error.set(e instanceof Error?e.message:'No se ha podido cargar el inventario.');}
  finally {
   this.cargando.set(false);
   if(this.visible && (!this.actualizaciones || this.actualizaciones.closed))this.iniciarActualizaciones();
  }
 }
 async exportar(formato:'pdf'|'csv'):Promise<void> {
  if(this.exportando()||this.cargando()||this.error())return;
  this.exportando.set(true);this.avisoExportacion.set('');
  const productos=[...this.visibles()];
  try {
   if(formato==='csv')this.informes.csv(productos);
   else await this.informes.pdf(productos,`${this.bajos()?'Stock bajo (hasta 5 unidades)':'Todo el catálogo'}${this.nombre()?'; nombre: '+this.nombre():''}`);
   this.avisoExportacion.set('Informe '+formato.toUpperCase()+' generado con '+productos.length+' productos.');
  }catch{this.avisoExportacion.set('No se ha podido generar el informe. Inténtalo de nuevo.');}
  finally{this.exportando.set(false);}
 }
}
