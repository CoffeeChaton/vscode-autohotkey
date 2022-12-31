/* eslint-disable max-classes-per-file */
import * as vscode from 'vscode';
import type { CAhkInclude } from './CAhkInclude';

export type TBaseLineParam = {
    name: string,
    range: vscode.Range,
    selectionRange: vscode.Range,
    uri: vscode.Uri,
};

export class CAhkDirectives extends vscode.DocumentSymbol {
    // #Directives
    // exp #AllowSameLineComments
    // https://www.autohotkey.com/docs/commands/_AllowSameLineComments.htm
    public readonly uri: vscode.Uri;
    /**
     * hashtag is without # && toUpperCase()
     * exp : #noEnv -> NOENV
     */
    public readonly hashtag: string; //

    declare public readonly kind: vscode.SymbolKind.Event;
    declare public readonly detail: '#Directives';
    declare public readonly children: never[];

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: TBaseLineParam,
    ) {
        super(name, '#Directives', vscode.SymbolKind.Event, range, selectionRange);
        this.uri = uri;
        this.hashtag = name.replace('#', '').toUpperCase();
    }
}

export class CAhkHotKeys extends vscode.DocumentSymbol {
    // https://www.autohotkey.com/docs/misc/Labels.htm
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.Event;
    declare public readonly detail: 'HotKeys';
    declare public readonly children: never[];

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: TBaseLineParam,
    ) {
        super(name, 'HotKeys', vscode.SymbolKind.Event, range, selectionRange);
        this.uri = uri;
    }
}

export class CAhkHotString extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.Event;
    declare public readonly detail: 'HotString';
    declare public readonly children: never[];

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: TBaseLineParam,
    ) {
        super(name, 'HotString', vscode.SymbolKind.Event, range, selectionRange);
        this.uri = uri;
    }
}

/**
 * AHK_L will auto diag of Duplicate label.
 *
 * auto diag1
 * ```c++
 *     return ScriptError(_T("Duplicate label."), aLabelName);
 * ```
 * auto diag2
 * ```c++
 *     LineError(_T("A Goto/Gosub must not jump into a block that doesn't enclose it."));
 * ```
 */
export class CAhkLabel extends vscode.DocumentSymbol {
    // https://www.autohotkey.com/docs/misc/Labels.htm
    // Label names must be unique throughout the whole script.
    public readonly uri: vscode.Uri;

    /**
     * label: -> LABEL
     */
    public readonly upName: string;
    declare public readonly kind: vscode.SymbolKind.Namespace;
    declare public readonly detail: 'label';
    declare public readonly children: never[];

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: TBaseLineParam,
    ) {
        super(name, 'label', vscode.SymbolKind.Namespace, range, selectionRange);
        this.uri = uri;
        this.upName = name.slice(0, -1).toUpperCase();
    }
}

export class CAhkComment extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.Package;
    declare public readonly detail: '';
    declare public readonly children: never[];

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: TBaseLineParam,
    ) {
        super(name, '', vscode.SymbolKind.Package, range, selectionRange);
        this.uri = uri;
    }
}

export type TLineClass =
    | CAhkComment
    | CAhkDirectives
    | CAhkHotKeys
    | CAhkHotString
    | CAhkInclude
    | CAhkLabel;
