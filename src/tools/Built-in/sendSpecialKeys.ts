/* eslint-disable @typescript-eslint/naming-convention */

type TA_SendCore = {
    label: string;
    icon: string;
    doc: string[];
    insertText: string;
    uri: string;
};

type TA_Send = {
    // key is Private
    [k in string]: TA_SendCore;
};

export const A_Send: TA_Send = {
    F12: {
        label: '{F1-F12}',
        icon: '{F1-F12}',
        doc: ['Function keys. For example: {F12} is **F12** on keypad'],
        insertText: 'F12',
        uri: 'https://www.autohotkey.com/docs/commands/Send.htm#keynames',
    },
    Text: {
        label: '{Text}',
        icon: 'Text mode',
        doc: [
            'Enables the *Text mode*, which sends a stream of characters rather than keystrokes.',
            'exp:',
            '    Send {Text} your text',
        ],
        insertText: 'Text',
        uri: 'https://www.autohotkey.com/docs/commands/Send.htm#Text',
    },
    Up: {
        label: '{Up}',
        icon: '↑',
        doc: ['↑ (up arrow) on main keyboard'],
        insertText: 'Up',
        uri: 'https://www.autohotkey.com/docs/commands/Send.htm#keynames',
    },
    // 'Blind',
    // 'Click',
    // 'Raw',
    // 'AltDown',
    // 'AltUp',
    // 'ShiftDown',
    // 'ShiftUp',
    // 'CtrlDown',
    // 'CtrlUp',
    // 'LWinDown',
    // 'LWinUp',
    // 'RWinDown',
    // 'RWinUp',
    // 'Enter',
    // 'Escape',
    // 'Esc',
    // 'Space',
    // 'Tab',
    // 'Text',
    // 'PrintScreen',
    // 'Click 100, 200, 0',
};

// TODO send https://www.autohotkey.com/docs/commands/Send.htm#keynames
