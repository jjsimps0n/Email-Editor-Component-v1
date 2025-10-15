
export type RowId = string;
export type ColId = string;
export type BlockId = string;

export type Mode = 'editor' | 'preview';
export type SideTab = 'content' | 'rows' | 'settings';

export type BlockType = 'title' | 'paragraph' | 'button';

export interface BoxStyle {
  blockBgColor?: string;
  blockPadding?: number;
  marginTop?: number;
  marginBottom?: number;
  blockBorderWidth?: number;
  blockBorderColor?: string;
  blockBorderRadius?: number;
  hideOnMobile?: boolean;
  hideOnDesktop?: boolean;
  cssClass?: string;
  id?: string;
}

export interface TitleData extends BoxStyle {
  text: string;
  align: 'left' | 'center' | 'right';
  bold: boolean;
  italic: boolean;
  underline: boolean;
  fontSize: number;
  textColor: string;
  textBgColor?: string;

  fontFamilyKey:
    | 'system' | 'arial' | 'georgia' | 'tahoma'
    | 'trebuchet' | 'verdana' | 'times';

  lineHeight?: number;
  letterSpacing?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';

  linkUrl?: string;
  linkColor?: string;
  linkUnderline?: boolean;

  mobileFontSize?: number;
  mobileAlign?: 'left' | 'center' | 'right';
}



export interface ParagraphData extends BoxStyle {
  html: string;
  align: 'left' | 'center' | 'right';
  fontSize: number;
  lineHeight: number;
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  fontFamilyKey:
    | 'system' | 'arial' | 'georgia' | 'tahoma'
    | 'trebuchet' | 'verdana' | 'times';
}

export interface ButtonData extends BoxStyle {
  label: string;
  url: string;
  align: 'left' | 'center' | 'right';
  fullWidth: boolean;

  textColor: string;
  bgColor: string;

  borderColor: string;
  borderWidth: number;
  borderRadius: number;

  paddingX: number;
  paddingY: number;

  bold: boolean;
  uppercase: boolean;
  letterSpacing: number;

  fontFamilyKey:
    | 'system' | 'arial' | 'georgia' | 'tahoma'
    | 'trebuchet' | 'verdana' | 'times';
}

export interface Block {
  id: BlockId;
  type: BlockType;
  data: TitleData | ParagraphData | ButtonData;
}

export interface Column {
  id: ColId;
  width: number;
  blocks: Block[];
}

export interface Row {
  id: RowId;
  padding?: number;
  gutter?: number;

  bgColor?: string;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;

  columns: Column[];
}

export interface EmailDoc {
  rows: Row[];
}
