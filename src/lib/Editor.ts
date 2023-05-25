import CodeMirror, { defaults } from 'codemirror';
import 'codemirror/addon/display/placeholder';

import './Editor.css';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/ttcn.css';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/gfm/gfm';

import { CheckboxPlugin, MentionPlugin } from './plugins';
import { type Defaults, type Options, configure, configureNew } from './utils/Configuration';

export type EditorEventMap = CodeMirror.EditorEventMap;

export interface Plugin {
    initialize: (editor: Editor) => void;
};

export interface EditorConfiguration {
    mode: 'markdown' | 'gfm';
    theme: string;
    lineNumbers: boolean;
    plugins: Plugin[];
    value?: string;
    placeholder: string;
    autofocus: boolean;
    wrap: boolean;
}

export const defaultConfig: Defaults<EditorConfiguration> = {
    mode: 'gfm',
    theme: 'ttcn',
    lineNumbers: false,
    placeholder: '',
    autofocus: false,
    wrap: true,
    plugins: [
        new CheckboxPlugin()
    ],
};

export class Editor {

    private _view: CodeMirror.Editor;
    private _plugins: Plugin[];

    constructor(element: HTMLElement, opts?: Options<EditorConfiguration>) {
        const configuration = configureNew(opts, defaultConfig);

        const defaultValue = configuration.value ?? element.innerText;
        element.innerHTML = '';

        this._view = CodeMirror(element, {
            mode: configuration.mode === 'gfm' ? 'gfm' : 'markdown',    // While TS will enforce this, JS wont.
            theme: configuration.theme,
            lineNumbers: configuration.lineNumbers,
            placeholder: configuration.placeholder,
            autofocus: configuration.autofocus,
            lineWrapping: configuration.wrap,
        });
        
        // @ts-ignore
        this._plugins = [];
        for (const plugin of configuration.plugins) {
            this.registerPlugin(plugin);
        }

        this.value = defaultValue;
    }

    get view() {
        return this._view;
    }

    get value(): string {
        return this._view.getValue();
    }

    set value(markdown: string) {
        this._view.setValue(markdown);
    }

    registerPlugin(plugin: Plugin) {
        this._plugins.push(plugin);
        plugin.initialize(this);
    }

    on<T extends keyof EditorEventMap>(eventName: T, handler: EditorEventMap[T]): void {
        this._view.on(eventName, handler);
    }

    off<T extends keyof EditorEventMap>(eventName: T, handler: EditorEventMap[T]): void {
        this._view.off(eventName, handler);
    }

    once<T extends keyof EditorEventMap>(eventName: T, handler: EditorEventMap[T]): void {
        const wrappedHandler = (...args) => {
            this._view.off(eventName, wrappedHandler);
            //@ts-ignore
            handler(args);
        };
        this._view.on(eventName, wrappedHandler);
    }
}