import { TestBed } from '@angular/core/testing';
import { Auth } from './auth';
import { Supabase } from './supabase';

describe('Auth con Supabase', () => {
  const getUser = vi.fn();
  const signInWithPassword = vi.fn();
  const signOut = vi.fn();
  const user = { email: 'prueba@example.com', app_metadata: { rol: 'admin' }, is_anonymous: false };
  beforeEach(() => {
    getUser.mockReset().mockResolvedValue({ data: { user: null }, error: null });
    signInWithPassword.mockReset();
    signOut.mockReset().mockResolvedValue({ error: null });
    TestBed.configureTestingModule({ providers: [{ provide: Supabase, useValue: {
      client: { auth: { getUser, signInWithPassword, signOut, onAuthStateChange: vi.fn() } },
    } }] });
  });

  it('usa la autenticación real y el rol de app_metadata', async () => {
    signInWithPassword.mockResolvedValue({ data: { user }, error: null });
    const auth = TestBed.inject(Auth);
    expect(await auth.login(' PRUEBA@example.com ', 'contraseña-de-prueba')).toBe(true);
    expect(signInWithPassword).toHaveBeenCalledWith({ email: 'prueba@example.com', password: 'contraseña-de-prueba' });
    expect(auth.sesion()?.rol).toBe('admin');
  });

  it('no acepta roles procedentes de user_metadata', async () => {
    signInWithPassword.mockResolvedValue({ data: { user: { ...user, app_metadata: {}, user_metadata: { rol: 'admin' } } }, error: null });
    const auth = TestBed.inject(Auth);
    await expect(auth.login(user.email, 'contraseña-de-prueba')).rejects.toThrow('rol asignado');
    expect(auth.sesion()).toBeNull();
    expect(signOut).toHaveBeenCalledWith({ scope: 'local' });
  });

  it('permite reintentar aunque falle la restauración de sesión', async () => {
    getUser.mockRejectedValue(new Error('Sin conexión'));
    signInWithPassword.mockResolvedValue({ data: { user: null }, error: { code: 'invalid_credentials' } });
    const auth = TestBed.inject(Auth);
    expect(await auth.login(user.email, 'contraseña-de-prueba')).toBe(false);
    expect(auth.sesion()).toBeNull();
  });

  it('restaura la sesión antes de resolver el guard de administrador', async () => {
    getUser.mockResolvedValue({ data: { user }, error: null });
    const auth = TestBed.inject(Auth);
    await auth.lista;
    expect(auth.sesion()?.rol).toBe('admin');
  });
});
