import { Component, inject } from '@angular/core';
import { Auth } from './services/auth';
import { RouterLink, RouterLinkActive } from '@angular/router';

import {
  IonApp,
  IonSplitPane,
  IonMenu,
  IonContent,
  IonList,
  IonListHeader,
  IonNote,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonRouterLink,
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  archiveOutline,
  archiveSharp,
  bookmarkOutline,
  bookmarkSharp,
  heartOutline,
  heartSharp,
  mailOutline,
  mailSharp,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    RouterLink,
    RouterLinkActive,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterLink,
    IonRouterOutlet,
  ],
})
export class AppComponent {
  readonly auth = inject(Auth);
  protected get paginasVisibles() {
    const sesion = this.auth.sesion();
    return this.appPages.filter(p => !sesion ? p.url === '/login' :
      p.url !== '/login' && (sesion.rol === 'admin' || !['/dashboard','/nuevo-producto'].includes(p.url)));
  }
  protected readonly appPages = [
    {
      title: 'Productos',
      url: '/productos',
      icon: 'archive',
    },
    {
      title: 'Nuevo producto',
      url: '/nuevo-producto',
      icon: 'bookmark',
    },
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: 'heart',
    },
    {
      title: 'Acceso',
      url: '/login',
      icon: 'mail',
    },
    { title: 'Ayuda', url: '/ayuda', icon: 'mail' },
  ];

  constructor() {
    addIcons({
      archiveOutline,
      archiveSharp,
      bookmarkOutline,
      bookmarkSharp,
      heartOutline,
      heartSharp,
      mailOutline,
      mailSharp,
    });
  }
}
