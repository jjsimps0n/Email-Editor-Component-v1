import { TitleData } from '../email-builder.models';
import { css, escapeHtml, fontStack } from '../utils/style.util';
import { blockBoxCSS } from '../utils/box-css';

export function renderTitle(td: TitleData): string {
  const box = blockBoxCSS(td);
  const style = css([
    'margin:0',
    'white-space:pre-line',
    `text-align:${td.align}`,
    `font-weight:${td.bold ? 700 : 600}`,
    `font-style:${td.italic ? 'italic' : 'normal'}`,
    `text-decoration:${td.underline ? 'underline' : 'none'}`,
    `font-size:${td.fontSize}px`,
    'line-height:1.25',
    `color:${td.textColor || '#111827'}`,
    `background-color:${td.textBgColor || 'transparent'}`,
    `font-family:${fontStack(td.fontFamilyKey)}`
  ]);
  return `<div style="${box}"><h2 style="${style}">${escapeHtml(td.text || 'Title')}</h2></div>`;
}
