import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TitleData } from '../../email-builder.models';

@Component({
  selector: 'app-title-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './title-editor.html',
  styleUrls: ['./title-editor.scss']
})
export class TitleEditor {
  @Input({ required: true }) data!: TitleData;
  @Input() canMoveUp = false;
  @Input() canMoveDown = false;

  @Output() back = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() moveUp = new EventEmitter<void>();
  @Output() moveDown = new EventEmitter<void>();

  setAlign(a: 'left' | 'center' | 'right') { this.data.align = a; }
  toggleBold() { this.data.bold = !this.data.bold; }
  toggleItalic() { this.data.italic = !this.data.italic; }
  toggleUnderline() { this.data.underline = !this.data.underline; }
}
