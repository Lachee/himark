import CodeMirror from 'codemirror';
import type { Editor, Plugin } from '../Editor';
import { configure, type Defaults, type Options } from '../utils/Configuration';

const NewLinePattern = /^\[([xX ])\]\s\w/g;
const AnyPattern = /\[([xX ])\]\s\w/g;

export const defaultConfig : Defaults<CheckboxPlugin> = {
    allowSameLine: false
}

export class CheckboxPlugin implements Plugin 
{
    allowSameLine : boolean;

    constructor(opts? : Options<CheckboxPlugin>) {
        configure(this, opts, defaultConfig);
    }

    initialize(editor : Editor) {
        const { view } = editor;
    
        view.on('change', () => {
            replaceCheckboxes(view, this.allowSameLine ? AnyPattern : NewLinePattern);
        });
    
        view.on('mousedown', (_, event) => {
            if (event.target instanceof HTMLInputElement && event.target['handle'] !== undefined) {
                const target = event.target as HTMLInputElement &  { handle : { start : number, end : number, line : number } };
                if (target.tagName === 'INPUT' && target.type !== undefined && target.type === 'checkbox') {
                    const coords    = view.coordsChar({ left: event.clientX, top: event.clientY });
                    const line      = coords.line;
                    const start     = coords.ch - 3;
                    const end       = start + 3;
                    const newValue  = target.checked ? '[ ]' : '[x]';
                    view.replaceRange(newValue, { line: line, ch: start }, { line: line, ch: end });
                }
            }
        });
    }
}

function replaceCheckboxes(view : CodeMirror.Editor, pattern : RegExp) {
    
    view.eachLine((lineHandle) => {
        const lineText = lineHandle.text;
        let match;
        while ((match = pattern.exec(lineText)) !== null) {
            const start = match.index;
            const end   = start + match[0].length - 2;
            const line  = view.getLineNumber(lineHandle);

            const checkboxElement   = document.createElement('input') as HTMLInputElement & { handle : { start : number, end : number, line : number } };
            checkboxElement.handle  = { start, end, line };
            checkboxElement.type    = 'checkbox';
            checkboxElement.checked = match[1].toLowerCase() == 'x';

            view.markText(
                { line: line, ch: start },
                { line: line, ch: end },
                { replacedWith: checkboxElement }
            );
        }
    });
}