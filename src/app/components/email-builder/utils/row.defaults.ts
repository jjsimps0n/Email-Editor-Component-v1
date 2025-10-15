import { Row } from '../email-builder.models';

export function createDefaultRow(columns: number, id: (p:string)=>string): Row {
  const width = 1 / columns;
  return {
    id: id('row'),
    padding: 12,
    gutter: 12,
    bgColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 6,
    columns: Array.from({ length: columns }, () => ({
      id: id('col'),
      width,
      blocks: []
    }))
  };
}
