import { ButtonData } from '../email-builder.models';
import { css, fontStack, escapeHtml } from '../utils/style.util';
import { blockBoxCSS } from '../utils/box-css';

export function renderButton(bd: ButtonData): string {
  const box = blockBoxCSS(bd);
  const wrap = css([`text-align:${bd.align}`]);

  const a = css([
    `display:${bd.fullWidth ? 'block' : 'inline-block'}`,
    bd.fullWidth ? 'width:100%' : '',
    'text-align:center',
    `background-color:${bd.bgColor || 'transparent'}`,
    `color:${bd.textColor || '#111827'}`,
    'border-style:solid',
    `border-width:${bd.borderWidth}px`,
    `border-color:${bd.borderColor || 'transparent'}`,
    `border-radius:${bd.borderRadius}px`,
    `padding:${bd.paddingY}px ${bd.paddingX}px`,
    `font-weight:${bd.bold ? 700 : 600}`,
    `text-transform:${bd.uppercase ? 'uppercase' : 'none'}`,
    `letter-spacing:${bd.letterSpacing}px`,
    'text-decoration:none',
    `font-family:${fontStack(bd.fontFamilyKey)}`
  ]);

  const label = escapeHtml(bd.label || 'Button');
  const href = (bd.url && (bd.url.startsWith('http') || bd.url.startsWith('mailto:'))) ? bd.url : '#';
  return `<div style="${box}"><div style="${wrap}"><a href="${href}" style="${a}">${label}</a></div></div>`;
}
