import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';
import { Auth } from '../../services/auth';
import { LoginPage } from './login.page';

describe('LoginPage: fin del estado de carga', () => {
  const login = vi.fn();
  beforeEach(() => {
    login.mockReset();
    TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [provideRouter([]), provideIonicAngular(), { provide: Auth, useValue: { login } }],
    });
  });

  async function preparar() {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.componentInstance.formulario.setValue({ email: 'prueba@example.com', password: 'contraseña-de-prueba' });
    await fixture.whenStable();
    return fixture;
  }

  it('actualiza la pantalla tras rechazar las credenciales, sin otro clic', async () => {
    let resolver!: (ok: boolean) => void;
    login.mockReturnValue(new Promise<boolean>(resolve => { resolver = resolve; }));
    const fixture = await preparar();
    const intento = fixture.componentInstance.entrar();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Accediendo');
    resolver(false);
    await intento;
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('p[role="alert"]').textContent).toContain('no son correctos');
    expect(fixture.nativeElement.querySelector('ion-button').disabled).toBe(false);
    expect(fixture.nativeElement.textContent).not.toContain('Accediendo');
  });

  it('recupera el botón tras un fallo de conexión', async () => {
    login.mockRejectedValue(new Error('No se ha podido conectar con Supabase.'));
    const fixture = await preparar();
    await fixture.componentInstance.entrar();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('p[role="alert"]').textContent).toContain('Supabase');
    expect(fixture.componentInstance.cargando()).toBe(false);
  });

  it('navega a productos después de autenticar y evita solicitudes duplicadas', async () => {
    let resolver!: (ok: boolean) => void;
    login.mockReturnValue(new Promise<boolean>(resolve => { resolver = resolve; }));
    const fixture = await preparar();
    const navegar = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    const intento = fixture.componentInstance.entrar();
    await fixture.componentInstance.entrar();
    expect(login).toHaveBeenCalledTimes(1);
    resolver(true);
    await intento;
    expect(navegar).toHaveBeenCalledWith('/productos', { replaceUrl: true });
    expect(fixture.componentInstance.cargando()).toBe(false);
  });
});
