import { Block } from '../email-builder.models';
import { renderTitle } from './title.renderer';
import { renderParagraph } from './paragraph.renderer';
import { renderButton } from './button.renderer';

export function renderBlockHtml(b: Block): string {
  switch (b.type) {
    case 'title':     return renderTitle(b.data as any);
    case 'paragraph': return renderParagraph(b.data as any);
    case 'button':    return renderButton(b.data as any);
    default:          return '';
  }
}
