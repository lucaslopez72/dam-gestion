import { cpSync } from 'node:fs';

cpSync(new URL('../docs/evidencias/', import.meta.url), new URL('../www/evidencias/', import.meta.url), { recursive: true });
