import { ParagraphData } from '../email-builder.models';
import { css, fontStack } from '../utils/style.util';
import { blockBoxCSS } from '../utils/box-css';

export function renderParagraph(pd: ParagraphData): string {
  const box = blockBoxCSS(pd);
  const style = css([
    'white-space:normal',
    `text-align:${pd.align}`,
    `font-size:${pd.fontSize}px`,
    `line-height:${pd.lineHeight}`,
    `text-transform:${pd.textTransform}`,
    `font-family:${fontStack(pd.fontFamilyKey)}`
  ]);
  return `<div style="${box}"><div style="${style}">${pd.html || ''}</div></div>`;
}
