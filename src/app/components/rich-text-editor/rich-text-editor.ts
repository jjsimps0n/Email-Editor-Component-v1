import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

type BlockTag = 'p'|'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'blockquote';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './rich-text-editor.html',
  styleUrl: './rich-text-editor.scss'
})
export class RichTextEditor {
  @Input() mode: 'default' | 'float' = 'default';
  @Input() placeholder = 'Start typing…';
  @Input() initialHtml = '<p><br></p>';

  @Output() htmlChange = new EventEmitter<string>();

  constructor(private host: ElementRef<HTMLElement>) {}

  @ViewChild('editor', { static: false }) editorRef!: ElementRef<HTMLDivElement>;
  @ViewChild('floatTb', { static: false }) floatTbRef?: ElementRef<HTMLDivElement>;

  baseFontPx = 16;
  wordCount = 0;
  charCount = 0;
  preview = false; 
  currentFormatBlock: BlockTag = 'p';

  showFloatToolbar = false;
  floatX = 0; 
  floatY = 0;
  private savedRange: Range | null = null;

  ngAfterViewInit() {
    this.editor.innerHTML = this.initialHtml || '<p><br></p>';
    this.applyBaseFont();
    this.updateCounts();
    if (this.mode === 'float') this.preview = false;
  }

  private get editor(): HTMLDivElement {
    return this.editorRef.nativeElement;
  }
  private emitChange() { this.htmlChange.emit(this.editor.innerHTML); }

  exec(command: string, value?: any) {
    if (this.mode === 'float') this.restoreSelection();
    if (this.preview) return;
    document.execCommand(command, false, value);
    this.emitChange();
    this.updateCounts();
  }

  setBlock(tag: BlockTag) {
    this.exec('formatBlock', tag === 'p' ? 'P' : tag.toUpperCase());
    this.currentFormatBlock = tag;
  }

  makeLink() {
    if (this.preview) return;
    const url = prompt('Enter URL:', 'https://');
    if (url) this.exec('createLink', url);
  }

  clearFormatting() {
    this.exec('removeFormat');
    const spans = this.editor.querySelectorAll('span[style]');
    spans.forEach(s => s.replaceWith(...Array.from(s.childNodes)));
    this.emitChange();
  }

  onImagePicked(ev: Event) {
    if (this.mode !== 'default') return;
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.exec('insertImage', reader.result as string);
      input.value = '';
    };
    reader.readAsDataURL(file);
  }

  print() {
    if (this.mode !== 'default') return;
    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) return;
    w.document.write(`<!doctype html><meta charset="utf-8"><body>${this.editor.innerHTML}</body>`);
    w.document.close(); w.focus(); w.print(); w.close();
  }

  togglePreview() {
    if (this.mode === 'float') return;
    this.preview = !this.preview;
    if (!this.preview) this.editor.focus();
  }

  onInput() {
    this.emitChange();
    this.updateCounts();
  }

  private updateCounts() {
    if (this.mode === 'float') return; 
    const text = (this.editor.textContent || '').replace(/\u200b/g, '');
    this.wordCount = text.trim().length ? text.trim().split(/\s+/).length : 0;
    this.charCount = text.replace(/\s/g, '').length;
  }

  onPaste(ev: ClipboardEvent) {
    if (!ev.clipboardData) return;
    const html = ev.clipboardData.getData('text/html');
    if (!html) return; 
    ev.preventDefault();
    const clean = this.sanitizeHtml(html);
    this.insertHtmlAtCaret(clean);
  }

  private sanitizeHtml(dirty: string): string {
    const allowed = new Set([
      'A','P','BR','B','STRONG','I','EM','U','S','SPAN',
      'H1','H2','H3','H4','H5','H6','UL','OL','LI','BLOCKQUOTE','PRE','CODE','IMG','HR'
    ]);
    const parser = new DOMParser();
    const doc = parser.parseFromString(dirty, 'text/html');
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT, null);
    const toRemove: Element[] = [];
    for (let node = walker.nextNode() as Element | null; node; node = walker.nextNode() as Element | null) {
      if (!allowed.has(node.tagName)) toRemove.push(node);
      node.removeAttribute('style'); node.removeAttribute('class');
      if (node.tagName === 'A') {
        const href = node.getAttribute('href') || '';
        if (!/^https?:/i.test(href) && !href.startsWith('#')) node.removeAttribute('href');
        node.setAttribute('rel','noopener noreferrer'); node.setAttribute('target','_blank');
      }
      if (node.tagName === 'IMG') {
        const src = node.getAttribute('src') || '';
        if (!src.startsWith('data:')) node.remove();
      }
    }
    toRemove.forEach(n => n.replaceWith(...Array.from(n.childNodes)));
    return doc.body.innerHTML;
  }

  private insertHtmlAtCaret(html: string) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      this.editor.insertAdjacentHTML('beforeend', html);
    } else {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const frag = range.createContextualFragment(html);
      range.insertNode(frag);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    this.emitChange();
    this.updateCounts();
  }

  incBaseFont() { this.baseFontPx = Math.min(28, this.baseFontPx + 1); this.applyBaseFont(); }
  decBaseFont() { this.baseFontPx = Math.max(12, this.baseFontPx - 1); this.applyBaseFont(); }
  private applyBaseFont() { this.editor.style.setProperty('--base-font', `${this.baseFontPx}px`); }


  @HostListener('window:resize') onResize() { this.positionToolbarCentered(); }
  @HostListener('window:scroll') onScroll() { this.positionToolbarCentered(); }

  @HostListener('document:selectionchange')
  onSelectionChangeDoc() {
    if (this.mode !== 'float' || !this.showFloatToolbar) return;
    const sel = window.getSelection();
    const node = sel?.anchorNode || null;
    if (!node || !this.editor.contains(node)) {
      this.showFloatToolbar = false;
    }
  }

  @HostListener('document:mousedown', ['$event'])
  onDocMouseDown(ev: MouseEvent) {
    if (this.mode !== 'float') return;
    const target = ev.target as Node;
    const hostEl = this.host.nativeElement;
    const tb = this.floatTbRef?.nativeElement;
    if (tb && tb.contains(target)) return;
    if (!hostEl.contains(target)) {
      this.showFloatToolbar = false;
    }
  }

  onEditorFocus() {
    if (this.mode !== 'float') return;
    this.showFloatToolbar = true;
    setTimeout(() => {
      this.saveSelection();
      this.positionToolbarCentered();
    }, 0);
  }

  onEditorBlur(ev: FocusEvent) {
    if (this.mode !== 'float') return;
    const related = ev.relatedTarget as Node | null;
    const tbEl = this.floatTbRef?.nativeElement;
    if (tbEl && related && tbEl.contains(related)) return; 
    setTimeout(() => this.showFloatToolbar = false, 30);
  }

  onFloatToolbarMouseDown(ev: MouseEvent) {
    if (this.mode !== 'float') return;
    ev.preventDefault();
    this.saveSelection();
  }

  private saveSelection() {
    const sel = window.getSelection();
    this.savedRange = sel && sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
  }
  private restoreSelection() {
    const sel = window.getSelection();
    if (this.savedRange && sel) {
      sel.removeAllRanges();
      sel.addRange(this.savedRange);
    }
  }

  private positionToolbarCentered() {
    if (this.mode !== 'float' || !this.showFloatToolbar) return;
    const rect = this.editor.getBoundingClientRect();
    const tb = this.floatTbRef?.nativeElement;
    const tbW = tb ? tb.offsetWidth : 320;
    const tbH = tb ? tb.offsetHeight : 40;
    const pad = 8;

    let left = rect.left + (rect.width - tbW) / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tbW - 8));

    let top = rect.top - tbH - pad;
    if (top < 8) top = rect.top + pad;

    this.floatX = left;
    this.floatY = top;
  }
}
