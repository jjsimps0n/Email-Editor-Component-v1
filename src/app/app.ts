import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import 'zone.js';
import { EmailBuilder } from "./components/email-builder/email-builder";
import { RichTextEditor } from './components/rich-text-editor/rich-text-editor';


type View = 'home' | 'email' | 'editor';
type EditorMode = 'default' | 'float';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EmailBuilder, RichTextEditor],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

   view: View = 'home';
  editorMode: EditorMode = 'default';

  openEmail() { this.view = 'email'; }
  openEditor(mode: EditorMode = 'default') { this.editorMode = mode; this.view = 'editor'; }
  backToHome() { this.view = 'home'; }

  // Optional: exit fullscreen email with ESC (no visible back button)
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.view === 'email') this.view = 'home';
  }

}
