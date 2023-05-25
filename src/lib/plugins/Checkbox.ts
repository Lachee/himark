import CodeMirror from 'codemirror';

export function checkboxPlugin(editor : CodeMirror.Editor) {
    editor.on('change', () => {
        replaceCheckboxes(editor);
    });

    // Event listener for checkbox clicks
    editor.on('mousedown', (_, event) => {
        if (event.target instanceof HTMLInputElement && event.target['handle'] !== undefined) {
            const target = event.target as HTMLInputElement &  { handle : { start : number, end : number, line : number } };
            if (target.tagName === 'INPUT' && target.type !== undefined && target.type === 'checkbox') {
                const coords = editor.coordsChar({ left: event.clientX, top: event.clientY });
                const line      = coords.line;
                const start     = coords.ch - 3;
                const end       = start + 3;
                const newValue  = target.checked ? '[ ]' : '[x]';
                console.log('line', line, 'start', start);
                editor.replaceRange(newValue, { line: line, ch: start }, { line: line, ch: end });
            }
        }
    });
}

function replaceCheckboxes(editor : CodeMirror.Editor) {
    const pattern = /\[([xX ])\]/g;

    editor.eachLine((lineHandle) => {
        const lineText = lineHandle.text;
        let match;
        while ((match = pattern.exec(lineText)) !== null) {
            const start = match.index;
            const end = start + match[0].length;
            const line = editor.getLineNumber(lineHandle);

            const checkboxElement   = document.createElement('input') as HTMLInputElement & { handle : { start : number, end : number, line : number } };
            checkboxElement.handle  = { start, end, line };
            checkboxElement.type    = 'checkbox';
            checkboxElement.checked = match[1].toLowerCase() == 'x';

            editor.markText(
                { line: line, ch: start },
                { line: line, ch: end },
                { replacedWith: checkboxElement }
            );
        }
    });
}