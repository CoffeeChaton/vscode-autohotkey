/* eslint-disable no-magic-numbers */
import { DeepReadonly } from '../../globalEnum';

export type TLaunchRequestArguments = DeepReadonly<{
    /** "Autohotkey Debugger" */
    name: string;

    /** An absolute path to the "program" to debug. */
    program: string;

    /** "launch" */
    request?: string;

    /** An absolute path to the AutoHotkey.exe. */
    runtime: string;

    /** If noDebug is true the launch request should launch the program without enabling debugging. */
    noDebug?: boolean;

    /** Optional data from the previous, restarted session.
         The data is sent as the 'restart' attribute of the 'terminated' event.
         The client should leave the data intact.
     */
    __restart?: unknown;

    /** "ahk" */
    type?: string;

    dbgpSettings: {
        max_children: number;
        max_data: number;
    };
    stopOnEntry: boolean;
    __configurationTarget: number;
    __sessionId: string; // "8c4fd54f-50ae-47aa-a1e9-d102a902686b",
}>;

export const enum EVarScope {
    LOCAL = 0,
    GLOBAL = 1,
}

export const enum EVarScopeStr {
    Local = 'Local--88',
    Global = 'Global',
}

export const enum EVscodeScope {
    LOCAL = 1000,
    GLOBAL = 1001,
}

/**
 * EContinue
 * debug session for vscode.
 */
export const enum EContinue {
    BREAK = 'break',
    RUN = 'run',
    STEP_OVER = 'step_over',
    STEP_OUT = 'step_out',
    STEP_INTO = 'step_into',
}

type TDbgpResponseStack = {
    attr: {
        filename: string;
        level: string;
        lineno: string;
        type: string;
        where: string;
    };
};

/**
//  <property>
//     name="short_name"
//     fullname="long_name"
//      type="data_type"
//     classname="name_of_object_class"
//     constant="0|1"
//     children="0|1"
//     size="{NUM}"
//     page="{NUM}"
//     pagesize="{NUM}"
//     address="{NUM}"
//     key="language_dependent_key"
//      encoding="base64|none"
//      numchildren="{NUM}">
//     ...encoded Value Data...
//  </property>
*/
export type TDbgpPropertyAttr = {
    // type 1
    name?: string;
    fullname?: string;
    type?: 'string' | 'integer' | 'float' | 'object' | 'undefined';
    facet?: string;

    /**
     * 'Func' | 'File' | 'BoundFunc' | 'ObjectBase' | 'EnumBase' |
     * 'Property' | 'MetaObject' | 'ComObject' | 'ComEvent' | 'ComEnum' | 'ComArrayEnum' | 'WebBrowser'
     *  'Object' ... userDefObj
     */
    classname?: string;
    address?: string;
    /**
     *  "number"
     */
    size?: string;

    /**
     *  '0'
     */
    page?: string;

    /**
     * '300'
     */
    pagesize?: string;

    children?: string;
    numchildren?: string;
    encoding?: BufferEncoding;

    // type 2
    command?: string;
    transaction_id?: string;
};

export type TDbgpProperty = {
    attr?: TDbgpPropertyAttr;
    content?: string;
    property?: TDbgpProperty | TDbgpProperty[];
};

export type TAhkVariable = {
    name: string;
    frameId: number;
    scope: EVarScope;
    value: string | Map<string, string>;
};
export type TDbgpResponse = {
    attr: {
        /** only one stack */
        stack: TDbgpResponseStack;
        command: string;
        context: string;
        transaction_id: string;
        success: '0' | '1';
        /** Breakpoint id */
        id: number;
        /** run state */
        status: string;
    };
    // children: {
    stack: TDbgpResponseStack | TDbgpResponseStack[];
    property: TDbgpProperty | TDbgpProperty[];
    error?: {
        attr: {
            code: number;
        };
    };
    // },
};
