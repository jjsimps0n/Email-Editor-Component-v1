import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ParagraphData } from '../../email-builder.models';

@Component({
  selector: 'app-paragraph-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './paragraph-editor.html',
  styleUrls: ['./paragraph-editor.scss']
})
export class ParagraphEditor implements OnInit, OnDestroy {
  @Input({ required: true }) data!: ParagraphData;
  @Input() canMoveUp = false;
  @Input() canMoveDown = false;

  @Output() back = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() moveUp = new EventEmitter<void>();
  @Output() moveDown = new EventEmitter<void>();

  @ViewChild('rte', { static: true }) rteRef!: ElementRef<HTMLDivElement>;

  private savedRange: Range | null = null;

  fontOptions = [
    { key: 'system',    label: 'System' },
    { key: 'arial',     label: 'Arial' },
    { key: 'georgia',   label: 'Georgia' },
    { key: 'tahoma',    label: 'Tahoma' },
    { key: 'trebuchet', label: 'Trebuchet MS' },
    { key: 'verdana',   label: 'Verdana' },
    { key: 'times',     label: 'Times' }
  ];

  ngOnInit(): void {
    const el = this.rteRef.nativeElement;
    el.innerHTML = this.data?.html || '';
    document.addEventListener('selectionchange', this.handleSelectionChange, true);
  }

  ngOnDestroy(): void {
    document.removeEventListener('selectionchange', this.handleSelectionChange, true);
  }
  isCmdActive(cmd: 'bold' | 'italic' | 'underline'): boolean {
    try {
      return document.queryCommandState(cmd);
    } catch {
      return false;
    }
  }

  private handleSelectionChange = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (this.rteRef?.nativeElement.contains(range.commonAncestorContainer)) {
      this.savedRange = range.cloneRange();
    }
  };

  private restoreSelection() {
    if (!this.savedRange) return;
    const sel = window.getSelection();
    if (!sel) return;
    sel.removeAllRanges();
    sel.addRange(this.savedRange);
  }

  private exec(command: string, value?: string) {
    this.rteRef.nativeElement.focus();
    this.restoreSelection();
    try {
      document.execCommand(command, false, value);
    } catch { /* noop */ }
    this.onInput();
  }

  toggleBold()      { this.exec('bold'); }
  toggleItalic()    { this.exec('italic'); }
  toggleUnderline() { this.exec('underline'); }

  setTextColor(color: string) { this.exec('foreColor', color || '#000000'); }
  setBgColor(color: string)   {
    try { this.exec('hiliteColor', color || 'transparent'); }
    catch { this.exec('backColor', color || 'transparent'); }
  }

  makeLink() {
    let url = prompt('Enter URL (https://...)', 'https://');
    if (!url) return;
    if (!/^https?:\/\//i.test(url) && !/^mailto:/i.test(url)) url = 'https://' + url;
    this.exec('createLink', url);
  }

  clearFormatting() {
    this.exec('removeFormat');
    this.exec('unlink');
  }

  onInput() {
    this.data.html = this.rteRef.nativeElement.innerHTML;
  }

  onPaste(e: ClipboardEvent) {
    e.preventDefault();
    const text = e.clipboardData?.getData('text/plain') || '';
    document.execCommand('insertText', false, text);
    this.onInput();
  }
}
