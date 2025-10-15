import { ParagraphData } from '../../email-builder.models';

export function createDefaultParagraph(): ParagraphData {
  return {
    html: 'Your paragraph text goes here.',
    align: 'left',
    fontSize: 16,
    lineHeight: 1.5,
    fontFamilyKey: 'system',
    textTransform: 'none',
    blockBgColor: '',
    blockPadding: 0,
    marginTop: 0,
    marginBottom: 12,
    blockBorderWidth: 0,
    blockBorderColor: '#e5e7eb',
    blockBorderRadius: 0
  };
}
