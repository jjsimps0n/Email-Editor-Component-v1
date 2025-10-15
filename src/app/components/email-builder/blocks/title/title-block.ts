import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleData } from '../../../email-builder/email-builder.models';

@Component({
  selector: 'app-title-block',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title-block.html',
  styleUrls: ['./title-block.scss']
})
export class TitleBlock {
  @Input({ required: true }) data!: TitleData;
  fontStack(key: TitleData['fontFamilyKey']) {
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
