import CodeMirror from 'codemirror';
import './Editor.css';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/gfm/gfm';

import { linkPlugin } from './plugins/Link';
import { checkboxPlugin } from './plugins/Checkbox';

const defer = setTimeout;
export type EditorEventMap = CodeMirror.EditorEventMap;

export interface Config {
    mode : 'markdown'|'gfm';
    theme : string;
    lineNumbers : boolean;
}

export const defaultConfig : Config = {
    mode: 'gfm',
    theme: 'default',
    lineNumbers: false,
};

export default class Editor {
    view : CodeMirror.Editor;

    config : Config;

    constructor(element : HTMLElement, config? : Partial<Config>) {
        if (config === undefined) config = {};
        this.config = Object.assign(defaultConfig, config);

        const defaultValue = element.innerText;
        element.innerHTML = '';

        this.view = CodeMirror(element, {
            mode:           this.config.mode === 'gfm' ? 'gfm' : 'markdown',    // While TS will enforce this, JS wont.
            theme:          this.config.theme,
            lineNumbers:    this.config.lineNumbers,
            autofocus:      true,
        });

        this.registerPlugins();
        this.value = defaultValue;
    }

    private registerPlugins() {
        linkPlugin(this.view);
        checkboxPlugin(this.view);
    }

    get value() : string {
        return this.view.getValue();
    }

    set value(markdown : string) {
        this.view.setValue(markdown);
    }

    on<T extends keyof EditorEventMap>(eventName: T, handler: EditorEventMap[T]): void {
        this.view.on(eventName, handler);
    }

    off<T extends keyof EditorEventMap>(eventName: T, handler: EditorEventMap[T]): void {
        this.view.off(eventName, handler);
    }

    once<T extends keyof EditorEventMap>(eventName: T, handler: EditorEventMap[T]): void {
        const wrappedHandler = (...args) => {
            this.view.off(eventName, wrappedHandler);
            //@ts-ignore
            handler(args);
        };
        this.view.on(eventName, wrappedHandler);
    }
}