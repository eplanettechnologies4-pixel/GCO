import fs from 'fs';
import path from 'path';

const pub = (...p) => path.join(process.cwd(), 'public', ...p);

// public/ ke andar agar file maujood ho to path wapas, warna null (placeholder dikhega)
export function resolveImage(p) {
  if (!p) return null;
  if (typeof p === 'string' && (p.startsWith('http://') || p.startsWith('https://'))) return p;
  return fs.existsSync(pub(p.replace(/^\//, ''))) ? p : null;
}
