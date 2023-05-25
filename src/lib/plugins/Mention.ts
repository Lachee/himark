import Tribute from 'tributejs';
import type { TributeCollection } from 'tributejs/tributejs';

import { configure, type Defaults, type Options } from '../utils/Configuration';
import type { Editor, Plugin } from '../Editor';
import { Key } from '../utils/Keys';
import { replaceLinks } from './Link';

import 'tributejs/dist/tribute.css';
import './mention.css';

type TributeInstance =  Tribute<any> & {
    selectItemAtIndex(index : number, originalEvent : any) : void;
    hideMenu() : void;
    menuSelected : number;
}

export type Collection<T> = TributeCollection<T>;

export const defaultConfig: Defaults<MentionPlugin> = {
    includePrefix: false,
    collections: []
}

export class MentionPlugin implements Plugin {
    collections: Array<Collection<any>>;
    includePrefix: boolean;

    private _tribute: TributeInstance;

    constructor(opts?: Options<MentionPlugin>) {
        configure(this, opts, defaultConfig);
        this._tribute = new Tribute({
            collection: this.collections
        }) as TributeInstance;
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
        const { view } = editor;
        
        this._tribute.attach(view.getInputField());
        view.on('keydown', (_, evt) => {
            if (!this._tribute.isActive) return;
            switch(evt.keyCode) {
                default: 
                    return;

                case Key.Tab:
                case Key.Enter:
                    this._tribute.selectItemAtIndex(this._tribute.menuSelected, evt);
                    evt.preventDefault();
                    break;

                case Key.UpArrow:
                case Key.DownArrow:
                    evt.preventDefault();
                    break;
            };
        });

        view.on('change', (_, change) => {
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