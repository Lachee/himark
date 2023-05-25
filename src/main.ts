import * as Marked from 'marked';
import { Editor } from './lib/Editor';
import { Collection } from './lib/plugins/Mention';
import './main.css';

async function search(text): Promise<Array<TUser>> {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 5));
    return [
        { id: "1e67", name: "Lake", avatar: "e" },
        { id: "9632", name: "Bilbo Swaggings", avatar: "e" },
        { id: "2f57", name: "Eggs", avatar: "e" },
        { id: "82fe5", name: "Mayo", avatar: "e" },
        { id: "ac034", name: "Oranges", avatar: "e" },
    ]
}

interface TUser {
    id: string;
    name: string;
    avatar: string;
}

const UserCollection =  {
    trigger: '@',
    lookup: 'name',
    fillAttr: 'name',

    values: (text, cb) => {
        search(text).then(result => cb(result));
    }
} satisfies Collection<TUser>

function createEditor() {
        
    const elmEditor   = document.querySelector<HTMLElement>('.editor');
    const elmPreview  = document.querySelector<HTMLElement>('.preview');
    const elmMarkdown = document.querySelector<HTMLElement>('.markdown');
    const editor = new Editor(elmEditor, config);

    editor.on('change', () => {
        const markdown = editor.value;
        elmMarkdown.innerText = markdown;
        elmPreview.innerHTML = Marked.marked(markdown, { mangle: false, headerIds: false });
    });
    
    // Late update it so we can trigger all our events
    editor.value = editor.value;
    console.log('Editor Ready', editor);
}
