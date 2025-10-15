import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ButtonData } from '../../email-builder.models';

@Component({
  selector: 'app-button-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './button-editor.html',
  styleUrls: ['./button-editor.scss']
})
export class ButtonEditor {
  @Input({ required: true }) data!: ButtonData;

  @Input() canMoveUp = false;
  @Input() canMoveDown = false;

  @Output() back = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() moveUp = new EventEmitter<void>();
  @Output() moveDown = new EventEmitter<void>();

  fontOptions = [
    { key: 'system',    label: 'System' },
    { key: 'arial',     label: 'Arial' },
    { key: 'georgia',   label: 'Georgia' },
    { key: 'tahoma',    label: 'Tahoma' },
    { key: 'trebuchet', label: 'Trebuchet MS' },
    { key: 'verdana',   label: 'Verdana' },
    { key: 'times',     label: 'Times' }
  ];
}
