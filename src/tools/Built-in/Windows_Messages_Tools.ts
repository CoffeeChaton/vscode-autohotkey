import * as vscode from 'vscode';
import { winMsg } from './Windows_Messages';

function winMsg2Md(k: string, v: [number, string]): vscode.MarkdownString {
    // WM_DDE_EXECUTE -> [1000,'0x03E8']
    // WM_DDE_EXECUTE := 0x03E8 ; 1000

    const body = `${k} := ${v[1]} ; ${v[0]}`;
    const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
        .appendCodeblock(body, 'ahk')
        .appendMarkdown('Windows Messages')
        .appendMarkdown('\n\n')
        .appendMarkdown('[Read More of Windows Messages](https://www.autohotkey.com/docs/misc/SendMessageList.htm)');
    md.supportHtml = true;
    return md;
}

type TWinMsgMDMap = ReadonlyMap<string, vscode.MarkdownString>;

const winMsgMDMap: TWinMsgMDMap = ((): TWinMsgMDMap => {
    const map1 = new Map<string, vscode.MarkdownString>();
    //
    for (const [k, v] of winMsg.entries()) {
        map1.set(k, winMsg2Md(k, v));
    }
    return map1;
})();

const snippetWinMsg: readonly vscode.CompletionItem[] = ((): vscode.CompletionItem[] => {
    const tempList: vscode.CompletionItem[] = [];
    for (const [k, v] of winMsg.entries()) {
        const item = new vscode.CompletionItem({
            label: k, // Left
            description: 'winMsg', // Right
        });
        item.kind = vscode.CompletionItemKind.Variable;
        item.insertText = new vscode.SnippetString()
            .appendChoice([
                `${k} := ${v[1]} ; ${v[0]}`,
                `${k} := ${v[1]}`,
                v[1],
                `${v[0]}`,
            ]);

        item.detail = 'Windows Messages (neko-help)'; // description
        item.documentation = winMsgMDMap.get(k.toUpperCase()) ?? winMsg2Md(k, v);

        tempList.push(item);
    }
    return tempList;
})();

export function getSnippetWinMsg(PartStr: string): readonly vscode.CompletionItem[] {
    return PartStr.startsWith('WM') || PartStr.startsWith('wm')
        ? snippetWinMsg
        : [];
}

export function hover2winMsgMd(wordUp: string): vscode.MarkdownString | undefined {
    return winMsgMDMap.get(wordUp);
}
