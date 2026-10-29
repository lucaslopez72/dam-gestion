import { fetchConLimite, REQUEST_TIMEOUT_MS } from './supabase';

describe('Límite de espera de Supabase', () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

  it('cancela una petición que no responde', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn((_input, init: RequestInit) => new Promise((_resolve, reject) => {
      init.signal?.addEventListener('abort', () => reject(new DOMException('Timeout', 'AbortError')));
    })));
    const result = fetchConLimite('https://example.com');
    const assertion = expect(result).rejects.toMatchObject({ name: 'AbortError' });
    await vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS);
    await assertion;
    expect(vi.getTimerCount()).toBe(0);
  });

  it('respeta la cancelación del llamante', async () => {
    const controller = new AbortController();
    controller.abort();
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}'));
    vi.stubGlobal('fetch', fetchMock);
    await fetchConLimite('https://example.com', { signal: controller.signal });
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
  });
});
