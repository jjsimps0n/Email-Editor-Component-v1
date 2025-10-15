import { BlockType, TitleData, ParagraphData, ButtonData } from '../../email-builder.models';
import { createDefaultTitle } from '../title/title.defaults';
import { createDefaultParagraph } from '../paragraph/paragraph.defaults';
import { createDefaultButton } from '../button/button.defaults';

export type AnyBlockData = TitleData | ParagraphData | ButtonData;

export const DEFAULT_FACTORIES: Record<BlockType, () => AnyBlockData> = {
  title:     () => createDefaultTitle(),
  paragraph: () => createDefaultParagraph(),
  button:    () => createDefaultButton(),
};
