import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export const REQUEST_TIMEOUT_MS = 12000;

export const fetchConLimite: typeof fetch = async (input, init) => {
  const controller = new AbortController();
  const originalSignal = init?.signal ?? (input instanceof Request ? input.signal : undefined);
  const abort = () => controller.abort(originalSignal?.reason);
  if (originalSignal?.aborted) abort();
  else originalSignal?.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
    originalSignal?.removeEventListener('abort', abort);
  }
};

@Injectable({ providedIn: 'root' })
export class Supabase {
  readonly client = createClient(environment.supabaseUrl, environment.supabaseKey, {
    global: { fetch: fetchConLimite },
  });
}
