export function css(parts: Array<string | number | false | null | undefined>): string {
  return parts
    .map(p => (typeof p === 'number' ? String(p) : p))
    .filter(Boolean)
    .join(';');
}

export function escapeHtml(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function fontStack(key?: string): string {
  switch (key) {
    case 'system':    return "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif";
    case 'arial':     return "Arial,Helvetica,sans-serif";
    case 'georgia':   return "Georgia,Times,'Times New Roman',serif";
    case 'tahoma':    return "Tahoma,Verdana,Segoe,sans-serif";
    case 'trebuchet': return "'Trebuchet MS',Tahoma,sans-serif";
    case 'verdana':   return "Verdana,Geneva,sans-serif";
    case 'times':     return "Times,'Times New Roman',Georgia,serif";
    default:          return "Arial,Helvetica,sans-serif";
  }
}
