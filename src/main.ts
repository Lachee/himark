import * as Marked from 'marked';
import { Editor, EditorConfiguration } from './lib/Editor';
import { Collection } from './lib/plugins/Mention';
import './main.css';
import { CheckboxPlugin, MentionPlugin } from './lib/plugins';

async function search(text): Promise<Array<User>> {
    console.log('search', text);
    return [
        { id: "1e67", name: "Lake", avatar: "e" },
        { id: "9632", name: "Bilbo Swaggings", avatar: "e" },
        { id: "2f57", name: "Eggs", avatar: "e" },
        { id: "82fe5", name: "Mayo", avatar: "e" },
        { id: "ac034", name: "Oranges", avatar: "e" },
    ]
}

interface User {
    id: string;
    name: string;
    avatar: string;
}

const userCollection : Collection<User> = {
    trigger: '@',
    lookup: 'name',
    fillAttr: 'name',
    allowSpaces: true,
    selectTemplate: ({ original }) => `[@${original.name}](#/identity/${original.id})`,
    values: (text, cb) => search(text).then(result => cb(result)),
    replace: (label, url) => `<span style="padding: 3px; background: #e2e2e2;">${label}</span>`
};

function createEditor() {        
    const elmEditor   = document.querySelector<HTMLElement>('.editor');
    const elmPreview  = document.querySelector<HTMLElement>('.preview');
    const elmMarkdown = document.querySelector<HTMLElement>('.markdown');
    const editor = new Editor(elmEditor, {
        plugins: [
            new MentionPlugin({
                collections: [ 
                    userCollection,
                    {   // Example of a inline collection
                        trigger: '#',
                        lookup: 'name',
                        fillAttr: 'name',
                        values: (text, cb) => {
                            search(text).then(result => cb(result));
                        },
                    } satisfies Collection<User>
                ]
            }),
            new CheckboxPlugin()
        ]
    });

    editor.on('change', () => {
        const markdown = editor.value;
        elmMarkdown.innerText = markdown;
        elmPreview.innerHTML = Marked.marked(markdown, { mangle: false, headerIds: false });
    });
    
    // Late update it so we can trigger all our events
    editor.value = editor.value;
    console.log('Editor Ready', editor);
}

createEditor();