import Tribute from 'tributejs';
import type { TributeCollection } from 'tributejs/tributejs';

import type { Editor, Plugin } from '../Editor';
import { replaceLinks } from './Link';
import { configure, type Defaults, type Options } from '../utils/Configuration';

import 'tributejs/dist/tribute.css';
import './mention.css';

export type Collection<T> = TributeCollection<T>;

export const defaultConfig: Defaults<MentionPlugin> = {
    includePrefix: false,
    collections: []
}

export class MentionPlugin implements Plugin {
    collections: Array<Collection<any>>;
    includePrefix: boolean;

    private _tribute: Tribute<any>;

    constructor(opts?: Options<MentionPlugin>) {
        configure(this, opts, defaultConfig);
        this._tribute = new Tribute({
            collection: this.collections
        });
    }

    get tribute() { 
        return this._tribute;
    }

    /** Adds a new collection */
    addCollection<T>(collection: Collection<T>): MentionPlugin {
        this.collections.push(collection);
        return this;
    }

    initialize(editor: Editor): void {
        this._tribute.attach(editor.view.getInputField());

        const { view } = editor;
        view.on('change', (_, change) => {
            // if (change.text.length == 1) {
            //     const prefix = this.hasPrefix(change.text[0]);
            //     if (prefix !== false) {
            // 
            //     }
            // }

            replaceLinks(view, {
                check: (label) => this.hasPrefix(label) !== false,
                replace: (label, url, fullText) => {
                    const linkElement = document.createElement('a');
                    linkElement.textContent = label;
                    linkElement.href = '#';
                    linkElement.target = '_BLANK';
                    linkElement.title = label;
                    linkElement.setAttribute('data-href', url);
                    return linkElement;
                },
            });
        });
    }

    
    private hasPrefix(text: string): string | false {
        const collection = this.getCollection<any>(text);
        return collection ? collection.trigger : false;
    }

    private getCollection<T>(text: string): Collection<T> | undefined {
        const matches = this.collections.filter(collection => text.startsWith(collection.trigger));
        if (matches.length == 0) return undefined;
        return matches[0] as T;
    }
}