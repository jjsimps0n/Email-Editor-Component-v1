export type EmailBuilderI18n = Record<string, any>;

export function resolveI18n(obj: EmailBuilderI18n, path: string): any {
  return path.split('.').reduce((acc: any, key) =>
    (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

export function deepMerge<T extends Record<string, any>>(base: T, patch: Partial<T> = {}): T {
  const out: any = Array.isArray(base) ? [...(base as any)] : { ...(base as any) };
  for (const k of Object.keys(patch)) {
    const bv = (base as any)[k];
    const pv = (patch as any)[k];
    if (pv && typeof pv === 'object' && !Array.isArray(pv)) {
      out[k] = deepMerge(bv || {}, pv);
    } else if (pv !== undefined) {
      out[k] = pv;
    }
  }
  return out;
}
