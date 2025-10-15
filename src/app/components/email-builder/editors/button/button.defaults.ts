import { ButtonData } from '../../email-builder.models';

export function createDefaultButton(): ButtonData {
  return {
    label: 'Click me',
    url: 'https://example.com',
    align: 'left',
    fullWidth: false,
    textColor: '#ffffff',
    bgColor: '#2563eb',
    borderColor: '#2563eb',
    borderWidth: 1,
    borderRadius: 6,
    paddingX: 16,
    paddingY: 10,
    bold: true,
    uppercase: false,
    letterSpacing: 0.5,
    fontFamilyKey: 'system',
    blockBgColor: '',
    blockPadding: 0,
    marginTop: 0,
    marginBottom: 12,
    blockBorderWidth: 0,
    blockBorderColor: '#e5e7eb',
    blockBorderRadius: 0
  };
}
