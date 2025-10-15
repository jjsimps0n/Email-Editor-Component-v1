import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ParagraphData } from '../../../email-builder/email-builder.models';

@Component({
  selector: 'app-paragraph-block',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paragraph-block.html',
  styleUrls: ['./paragraph-block.scss']
})
export class ParagraphBlock {
  @Input({ required: true }) data!: ParagraphData;

  constructor(private sanitizer: DomSanitizer) {}

  get safeHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.data?.html || '');
  }

  fontStack(key: ParagraphData['fontFamilyKey']) {
    switch (key) {
      case 'system':    return "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
      case 'arial':     return "Arial, Helvetica, sans-serif";
      case 'georgia':   return "Georgia, Times, 'Times New Roman', serif";
      case 'tahoma':    return "Tahoma, Verdana, Segoe, sans-serif";
      case 'trebuchet': return "'Trebuchet MS', Tahoma, sans-serif";
      case 'verdana':   return "Verdana, Geneva, sans-serif";
      case 'times':     return "Times, 'Times New Roman', Georgia, serif";
    }
  }
}
