import CodeMirror from 'codemirror';

type Editor = CodeMirror.Editor;

export type ReplaceCallback = (label : string, url : string) => HTMLElement|string;
export type CheckCallback = (line : string, label : string, url : string) => boolean;

export interface ReplaceOptions {
    replace : ReplaceCallback;
    check? : CheckCallback;
    html? : boolean;
    pattern? : RegExp;
    classList? : string[];
}


export function linkPlugin(editor: Editor): void {
    editor.on('change', () => {
        replaceLinks(editor, (label, url) => {
            const linkElement = document.createElement('a');
            linkElement.textContent = label;
            linkElement.href = '#';            
            linkElement.setAttribute('data-href', url);
            return linkElement;
        });
    });
}

/**
 * 
 * @param editor The CodeMirror editor
 * @param replace Function that returns either a HTML element to replace it or the contents of the element.
 */
export function replaceLinks(editor : Editor, opts : ReplaceCallback|ReplaceOptions): void {
    const config = typeof opts !== 'function' ? opts : { 
        replace: opts,
        html: false,
    };
    
    const pattern = config.pattern ?? /\[([^\]]+)\]\(([^\)]+)\)/g;

    editor.eachLine(line => {
        const lineText = line.text;
        let match;
        while ((match = pattern.exec(lineText)) !== null) {
            const start = match.index;
            const end = start + match[0].length;

            // Abort because we failed check
            if (config.check && !config.check(match[0], match[1], match[2]))
                continue;
    
            // Invoke the replace function and get hte most appropriate element for it
            let replacedWith : HTMLElement;
            const replaceResults = config.replace(match[1], match[2]);
            if (replaceResults instanceof HTMLElement) {
                replacedWith = replaceResults;
            } else {
                // We got a string, so lets ensure we can put HTML in it.
                replacedWith = document.createElement('span');
                if (config.html === true) {
                    replacedWith.innerHTML = replaceResults;
                } else {
                    replacedWith.innerText = replaceResults;
                }
            }

            // Add additional classes that are required
            if (config.classList) {
                for(const styleClass of config.classList) {
                    replacedWith.classList.add(styleClass);
                }
            }

            const ln = editor.getLineNumber(line);
            editor.markText(
                { line: ln, ch: start },
                { line: ln, ch: end },
                { replacedWith }
            );
        }
    });
}