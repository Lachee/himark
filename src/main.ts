import { Editor } from './lib/Editor';
import './main.css';

import * as Marked from 'marked';
const toHTML = (markdown : string) =>  Marked.marked(markdown, { headerIds: false, mangle: false });

// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.ts'

const elmEditor   = document.querySelector<HTMLElement>('.editor');
const elmPreview  = document.querySelector<HTMLElement>('.preview');
const elmMarkdown = document.querySelector<HTMLElement>('.markdown');

const editor = new Editor(elmEditor);
editor.on('change', () => {
    const markdown = editor.value;
    elmMarkdown.innerText = markdown;
    elmPreview.innerHTML = Marked.marked(markdown, { mangle: false, headerIds: false });
});

// Late update it so we can trigger all our events
editor.value = editor.value;
console.log('Editor Ready', editor);