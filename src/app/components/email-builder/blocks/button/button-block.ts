import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonData } from '../../email-builder.models';

@Component({
  selector: 'app-button-block',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-block.html',
  styleUrls: ['./button-block.scss']
})
export class ButtonBlock {
  @Input({ required: true }) data!: ButtonData;

  fontStack(key: ButtonData['fontFamilyKey']) {
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
