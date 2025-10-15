import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import {
  RowId, ColId, BlockId, Mode, SideTab,
  BlockType, TitleData, Block, Column, Row, EmailDoc, ParagraphData, ButtonData, BoxStyle
} from './email-builder.models';

import { TitleBlock } from './blocks/title/title-block';
import { TitleEditor } from './editors/title/title-editor';

import { ParagraphBlock } from './blocks/paragraph/paragraph-block';
import { ParagraphEditor } from './editors/paragraph/paragraph-editor';

import { ButtonBlock } from './blocks/button/button-block';
import { ButtonEditor } from './editors/button/button-editor';

import { DEFAULT_FACTORIES } from './editors/defaults';
import { createDefaultRow } from './utils/row.defaults';
import { renderBlockHtml } from './renderers';

import { EN_I18N } from './i18n/en';
import { EmailBuilderI18n, deepMerge, resolveI18n } from './i18n/i18n';

type PanelState = { boxOpen: boolean; propsOpen: boolean };

@Component({
  selector: 'app-email-builder',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatIconModule, MatButtonModule, MatTooltipModule,
    TitleBlock, TitleEditor,
    ParagraphBlock, ParagraphEditor,
    ButtonBlock, ButtonEditor
  ],
  templateUrl: './email-builder.html',
  styleUrls: ['./email-builder.scss']
})
export class EmailBuilder {
  private _i18n: EmailBuilderI18n = EN_I18N;

  @Input() set translations(val: Partial<EmailBuilderI18n> | undefined) {
    this._i18n = deepMerge(EN_I18N, val || {});
  }
  t(path: string): string {
    const v = resolveI18n(this._i18n, path);
    return typeof v === 'string' ? v : path;
  }

  mode: Mode = 'editor';          // 'editor' | 'preview'
  tab: SideTab = 'content';       // 'content' | 'rows' | 'settings'

  previewW = 600;
  previewH = 1000;

  doc: EmailDoc = { rows: [] };

  selectedRowId?: RowId;
  selectedColId?: ColId;
  selectedBlockId?: BlockId;

  rowPanels = { rowOpen: true };
  private blockPanels = new Map<BlockId, PanelState>();

  constructor(private sanitizer: DomSanitizer) {}
  private _seq = 0;
  private uid(prefix: string): string {
    return `${prefix}_${Date.now().toString(36)}_${(this._seq++).toString(36)}`;
  }
  isTitle(b: Block | undefined): b is Block & { data: TitleData } {
    return !!b && b.type === 'title';
  }
  isParagraph(b: Block | undefined): b is Block & { data: ParagraphData } {
    return !!b && b.type === 'paragraph';
  }
  isButton(b: Block | undefined): b is Block & { data: ButtonData } {
    return !!b && b.type === 'button';
  }
  setTab(t: SideTab) { this.tab = t; }
  setMode(m: Mode) { this.mode = m; }

  clearSelection() {
    this.selectedRowId = undefined;
    this.selectedColId = undefined;
    this.selectedBlockId = undefined;
  }
  onCanvasClick() {
    if (this.mode === 'editor') this.clearSelection();
  }
  selectRow(rowId: RowId) {
    this.selectedRowId = rowId;
    this.selectedColId = undefined;
    this.selectedBlockId = undefined;
    this.tab = 'settings';
  }

  selectColumn(colId: ColId, rowId: RowId) {
    this.selectedRowId = rowId;
    this.selectedColId = colId;
    this.selectedBlockId = undefined;
  }

  selectBlock(blockId: BlockId, colId: ColId, rowId: RowId) {
    this.selectedRowId = rowId;
    this.selectedColId = colId;
    this.selectedBlockId = blockId;
    this.tab = 'settings';
    this.panelStateForSelected();
  }

  panelStateForSelected(): PanelState | undefined {
    const id = this.selectedBlockId;
    if (!id) return undefined;
    if (!this.blockPanels.has(id)) {
      this.blockPanels.set(id, { boxOpen: false, propsOpen: true });
    }
    return this.blockPanels.get(id)!;
  }

  onPanelToggle(which: 'rowOpen' | 'boxOpen' | 'propsOpen', ev: Event) {
    const open = !!(ev.target as HTMLDetailsElement).open;
    if (which === 'rowOpen') {
      this.rowPanels.rowOpen = open;
      return;
    }
    const id = this.selectedBlockId;
    if (!id) return;
    const s = this.panelStateForSelected();
    if (!s) return;
    (s as any)[which] = open;
  }

  addRow(columnsCount: 1 | 2 | 3 | 4) {
    const row = createDefaultRow(columnsCount, (p) => this.uid(p));
    this.doc.rows.push(row);
    this.selectedRowId = row.id;
    this.selectedColId = row.columns[0].id;
    this.selectedBlockId = undefined;
    this.tab = 'content';
  }

  addBlockToSelected(type: BlockType) {
    if (!this.selectedColId) return;
    const { col } = this.findSelected();
    if (!col) return;

    const block: Block = {
      id: this.uid('blk'),
      type,
      data: DEFAULT_FACTORIES[type]()
    };
    col.blocks.push(block);

    this.blockPanels.set(block.id, { boxOpen: false, propsOpen: true });

    this.selectedBlockId = block.id;
    this.tab = 'settings';
  }

  deleteRow(rowId: RowId) {
    const idx = this.doc.rows.findIndex(r => r.id === rowId);
    if (idx >= 0) {
      const row = this.doc.rows[idx];
      for (const col of row.columns) {
        for (const b of col.blocks) this.blockPanels.delete(b.id);
      }
      this.doc.rows.splice(idx, 1);
      if (this.selectedRowId === rowId) this.clearSelection();
    }
  }

  deleteSelectedBlock() {
    if (!this.selectedRowId || !this.selectedColId || !this.selectedBlockId) return;
    const targetId = this.selectedBlockId;
    const row = this.doc.rows.find(r => r.id === this.selectedRowId);
    const col = row?.columns.find(c => c.id === this.selectedColId);
    if (!col) return;

    const i = col.blocks.findIndex(b => b.id === targetId);
    if (i >= 0) {
      col.blocks.splice(i, 1);
      this.blockPanels.delete(targetId);
      this.selectedBlockId = undefined;
    }
  }

  clearAll() {
    this.doc = { rows: [] };
    this.blockPanels.clear();
    this.rowPanels.rowOpen = true;
    this.clearSelection();
  }
  moveSelectedBlock(delta: number) {
    if (!this.selectedRowId || !this.selectedColId || !this.selectedBlockId) return;

    const row = this.doc.rows.find(r => r.id === this.selectedRowId);
    const col = row?.columns.find(c => c.id === this.selectedColId);
    if (!col) return;

    const i = col.blocks.findIndex(b => b.id === this.selectedBlockId);
    if (i < 0) return;

    const j = i + delta;
    if (j < 0 || j >= col.blocks.length) return;

    const [moved] = col.blocks.splice(i, 1);
    col.blocks.splice(j, 0, moved);
    this.selectedBlockId = moved.id;
  }
  moveSelectedBlockUp()   { this.moveSelectedBlock(-1); }
  moveSelectedBlockDown() { this.moveSelectedBlock( 1); }

  get canMoveUp(): boolean {
    if (!this.selectedRowId || !this.selectedColId || !this.selectedBlockId) return false;
    const row = this.doc.rows.find(r => r.id === this.selectedRowId);
    const col = row?.columns.find(c => c.id === this.selectedColId);
    if (!col) return false;
    const i = col.blocks.findIndex(b => b.id === this.selectedBlockId);
    return i > 0;
  }
  get canMoveDown(): boolean {
    if (!this.selectedRowId || !this.selectedColId || !this.selectedBlockId) return false;
    const row = this.doc.rows.find(r => r.id === this.selectedRowId);
    const col = row?.columns.find(c => c.id === this.selectedColId);
    if (!col) return false;
    const i = col.blocks.findIndex(b => b.id === this.selectedBlockId);
    return i >= 0 && i < col.blocks.length - 1;
  }

  backToBlocks() { this.selectedBlockId = undefined; }

  getSelectedBlock(): Block | undefined {
    if (!this.selectedRowId || !this.selectedColId || !this.selectedBlockId) return undefined;
    const row = this.doc.rows.find(r => r.id === this.selectedRowId);
    const col = row?.columns.find(c => c.id === this.selectedColId);
    return col?.blocks.find(b => b.id === this.selectedBlockId);
  }

  get selectedTitleBlock(): (Block & { data: TitleData }) | undefined {
    const blk = this.getSelectedBlock();
    return this.isTitle(blk) ? blk : undefined;
  }
  get selectedParagraphBlock(): (Block & { data: ParagraphData }) | undefined {
    const blk = this.getSelectedBlock();
    return this.isParagraph(blk) ? blk : undefined;
  }
  get selectedButtonBlock(): (Block & { data: ButtonData }) | undefined {
    const blk = this.getSelectedBlock();
    return this.isButton(blk) ? blk : undefined;
  }

  trackRow = (_: number, row: Row) => row.id;
  trackCol = (_: number, col: Column) => col.id;
  trackBlock = (_: number, blk: Block) => blk.id;

  gridTemplateFor(row: Row) {
    return row.columns.map(c => `minmax(0, ${c.width}fr)`).join(' ');
  }

  isRowSelected(row: Row)   { return this.selectedRowId === row.id; }
  isColSelected(col: Column){ return this.selectedColId === col.id; }
  isBlockSelected(b: Block) { return this.selectedBlockId === b.id; }

  blockBoxStyle(b: Block) {
    const d = b.data as BoxStyle;
    return {
      'background-color': d.blockBgColor || 'transparent',
      'padding.px': d.blockPadding ?? 0,
      'margin-top.px': d.marginTop ?? 0,
      'margin-bottom.px': d.marginBottom ?? 0,
      'border-style': (d.blockBorderWidth ?? 0) > 0 ? 'solid' : 'none',
      'border-width.px': d.blockBorderWidth ?? 0,
      'border-color': d.blockBorderColor || 'transparent',
      'border-radius.px': d.blockBorderRadius ?? 0
    };
  }

  rowBoxStyle(row: Row) {
    return {
      'background-color': row.bgColor || '#fff',
      'padding.px': row.padding ?? 12,
      'border-style': (row.borderWidth ?? 0) > 0 ? 'solid' : 'none',
      'border-width.px': row.borderWidth ?? 0,
      'border-color': row.borderColor || 'transparent',
      'border-radius.px': row.borderRadius ?? 0
    };
  }

  get safePreviewHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.previewHtml);
  }

  get previewHtml(): string {
    const body = this.renderDocToHtml();
    return [
      '<!doctype html>',
      '<html>',
      '<head>',
      '<meta charset="utf-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
      '<title>Email Preview</title>',
      '<style>html,body{margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;}</style>',
      '</head>',
      '<body>',
      body,
      '</body>',
      '</html>'
    ].join('');
  }

  private renderDocToHtml(): string {
    let out = `<div style="max-width:600px;margin:0 auto;background:#ffffff;">`;

    for (const row of this.doc.rows) {
      const gutter  = row.gutter ?? 12;
      const padding = row.padding ?? 12;

      const rowBox =
        (row.bgColor ? `background-color:${row.bgColor};` : 'background-color:#ffffff;') +
        (row.borderWidth ? `border:${row.borderWidth}px solid ${row.borderColor || '#e5e7eb'};` : '') +
        (row.borderRadius != null ? `border-radius:${row.borderRadius}px;` : '');

      out += `<div style="display:flex;gap:${gutter}px;padding:${padding}px;box-sizing:border-box;${rowBox}">`;

      for (const col of row.columns) {
        const pct = Math.round((col.width * 100 + Number.EPSILON) * 100) / 100;
        out += `<div style="flex:0 0 ${pct}%;max-width:${pct}%;box-sizing:border-box;">`;
        for (const b of col.blocks) out += renderBlockHtml(b);
        out += `</div>`;
      }

      out += `</div>`;
    }

    out += `</div>`;
    return out;
  }

  private findSelected(): { row?: Row; col?: Column } {
    if (!this.selectedRowId || !this.selectedColId) return {};
    const row = this.doc.rows.find(r => r.id === this.selectedRowId);
    const col = row?.columns.find(c => c.id === this.selectedColId);
    return { row, col };
  }

  getSelectedRow(): Row | undefined {
    if (!this.selectedRowId) return undefined;
    return this.doc.rows.find(r => r.id === this.selectedRowId);
  }

  moveSelectedRow(delta: number) {
    if (!this.selectedRowId) return;
    const i = this.doc.rows.findIndex(r => r.id === this.selectedRowId);
    if (i < 0) return;
    const j = i + delta;
    if (j < 0 || j >= this.doc.rows.length) return;
    const [moved] = this.doc.rows.splice(i, 1);
    this.doc.rows.splice(j, 0, moved);
    this.selectedRowId = moved.id;
  }
  moveSelectedRowUp()   { this.moveSelectedRow(-1); }
  moveSelectedRowDown() { this.moveSelectedRow( 1); }

  get canMoveRowUp(): boolean {
    if (!this.selectedRowId) return false;
    return this.doc.rows.findIndex(r => r.id === this.selectedRowId) > 0;
  }
  get canMoveRowDown(): boolean {
    if (!this.selectedRowId) return false;
    const i = this.doc.rows.findIndex(r => r.id === this.selectedRowId);
    return i >= 0 && i < this.doc.rows.length - 1;
  }

  setPreviewSize(w: number, h: number) {
    this.previewW = Math.max(280, Math.round(w));
    this.previewH = Math.max(400, Math.round(h));
  }
  presetMobileNarrow() { this.setPreviewSize(360, 640); }
  presetIPhone12()     { this.setPreviewSize(390, 844); }
  presetTablet()       { this.setPreviewSize(768, 1024); }
  presetEmailWidth()   { this.setPreviewSize(600, 1000); }
  presetDesktop()      { this.setPreviewSize(1024, 900); }
}
