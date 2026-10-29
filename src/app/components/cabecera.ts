import { Component, input } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton } from '@ionic/angular';

/** CabeceraComponent compartida: abre el menú también cuando el panel lateral se oculta en móvil. */
@Component({
  selector: 'app-cabecera',
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton],
  template: `<ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button aria-label="Abrir menú de navegación" /></ion-buttons><ion-title>{{titulo()}}</ion-title></ion-toolbar></ion-header>`,
  styles: [':host{display:contents}'],
})
export class CabeceraComponent { readonly titulo = input.required<string>(); }
