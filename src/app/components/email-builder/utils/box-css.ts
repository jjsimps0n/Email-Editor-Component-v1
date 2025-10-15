import { BoxStyle, Row } from '../email-builder.models';

export function blockBoxCSS(d: BoxStyle): string {
  return [
    d.blockBgColor ? `background-color:${d.blockBgColor}` : '',
    d.blockPadding != null ? `padding:${d.blockPadding}px` : '',
    d.marginTop != null ? `margin-top:${d.marginTop}px` : '',
    d.marginBottom != null ? `margin-bottom:${d.marginBottom}px` : '',
    d.blockBorderWidth ? `border:${d.blockBorderWidth}px solid ${d.blockBorderColor || 'transparent'}` : '',
    d.blockBorderRadius != null ? `border-radius:${d.blockBorderRadius}px` : ''
  ].filter(Boolean).join(';');
}

export function rowBoxCSS(row: Row): string {
  return [
    `background-color:${row.bgColor || '#ffffff'}`,
    row.borderWidth ? `border:${row.borderWidth}px solid ${row.borderColor || '#e5e7eb'}` : '',
    row.borderRadius != null ? `border-radius:${row.borderRadius}px` : ''
  ].filter(Boolean).join(';');
}
