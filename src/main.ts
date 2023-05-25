import Editor from './lib/Editor';
import './main.css';

import * as Marked from 'marked';
const toHTML = (markdown : string) =>  Marked.marked(markdown, { headerIds: false, mangle: false });

// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.ts'

const elmEditor = document.getElementById('editor');
const elmPreview = document.getElementById('preview');

const editor = new Editor(elmEditor);
if (elmPreview) {
    editor.on('change', () => {
        const markdown = editor.value;
        elmPreview.innerHTML = toHTML(markdown);
    });

    // Force a trigger
    editor.value = editor.value;
}

