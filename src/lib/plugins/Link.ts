import CodeMirror from 'codemirror';
import type { Editor, Plugin } from '../Editor';

export type ReplaceCallback = (label : string, url : string, fullText : string) => HTMLElement|string;
export type CheckCallback = (label : string, url : string, fullText : string) => boolean;

export interface ReplaceOptions {
    replace : ReplaceCallback;
    check? : CheckCallback;
    html? : boolean;
    pattern? : RegExp;
    classList? : string[];
}

/** A really basic and dumb link plugin example */
export class ExampleLinkPlugin implements Plugin {
    initialize(editor: Editor): void {
        const { view } = editor;
        view.on('change', () => {
            replaceLinks(view, (label, url, fullText) => {
                const linkElement = document.createElement('a');
                linkElement.textContent = fullText;
                linkElement.href        = url;
                linkElement.target      = '_BLANK';
                linkElement.title       = label;
                linkElement.setAttribute('data-href', url);
                return linkElement;
            });
        });
    }
}

/**
 * Replaces all the markdown links with the given options
 * @param view The CodeMirror editor
 * @param replace Function that returns either a HTML element to replace it or the contents of the element.
 */
export function replaceLinks(view : CodeMirror.Editor, opts : ReplaceCallback|ReplaceOptions): void {
    const config = typeof opts !== 'function' ? opts : {    // Default Options
        replace: opts,
        html: false,
    };
    
    const pattern = config.pattern ?? /\[([^\]]+)\]\(([^\)]+)\)/g;
    view.eachLine(lineHandle => {
        const lineText = lineHandle.text;
        let match;
        while ((match = pattern.exec(lineText)) !== null) {
            const start = match.index;
            const end = start + match[0].length;

            // Abort because we failed check
            if (config.check && !config.check(match[1], match[2], match[0]))
                continue;
    
            // Invoke the replace function and get hte most appropriate element for it
            let replacedWith : HTMLElement;
            const replaceResults = config.replace(match[1], match[2], match[0]);
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

            const line = view.getLineNumber(lineHandle);
            view.markText(
                { line, ch: start },
                { line, ch: end },
                { replacedWith }
            );
        }
    });
}