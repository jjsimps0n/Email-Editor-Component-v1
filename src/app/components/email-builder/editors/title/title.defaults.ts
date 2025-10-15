import { TitleData } from '../../email-builder.models';

export function createDefaultTitle(): TitleData {
  return {
    text: 'Your Title',
    align: 'left',
    bold: true,
    italic: false,
    underline: false,
    fontSize: 24,
    textColor: '#111827',
    textBgColor: '',
    fontFamilyKey: 'system',
    lineHeight: 1.25,
    letterSpacing: 0,
    textTransform: 'none',
    linkUrl: '',
    linkColor: '',
    linkUnderline: false,
    mobileFontSize: undefined,
    mobileAlign: undefined,
    blockBgColor: '',
    blockPadding: 10,
    marginTop: 0,
    marginBottom: 12,
    blockBorderWidth: 0,
    blockBorderColor: '#e5e7eb',
    blockBorderRadius: 0
  };
}
