import { CabeceraComponent } from '../../components/cabecera';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonText,
  IonSpinner,
} from '@ionic/angular';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CabeceraComponent,
    ReactiveFormsModule,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonText,
    IonSpinner,
  ],
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  readonly cargando = signal(false);
  readonly error = signal('');
  readonly mostrarPassword = signal(false);

  readonly formulario = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  async entrar(): Promise<void> {
    if (this.cargando()) {
      return;
    }

    this.error.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando.set(true);

    try {
      const { email, password } = this.formulario.getRawValue();
      const accesoCorrecto = await this.auth.login(email, password);

      if (!accesoCorrecto) {
        this.error.set('El correo o la contraseña no son correctos.');
        return;
      }

      await this.router.navigateByUrl('/productos', {
        replaceUrl: true,
      });
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'No se ha podido iniciar sesión. Inténtalo de nuevo.');
    } finally {
      this.cargando.set(false);
    }
  }
}
