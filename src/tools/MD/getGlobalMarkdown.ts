import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { globalVal2Msg, TGlobalValReadonly } from '../../core/ParserTools/ahkGlobalDef';

export function getGlobalMarkdown(wordUp: string): vscode.MarkdownString | null {
    const msgList: string[] = [];
    const fsPathList: string[] = Detecter.getDocMapFile();
    for (const fsPath of fsPathList) {
        const GlobalVal: TGlobalValReadonly | undefined = Detecter
            .getDocMap(fsPath)
            ?.GValMap
            .get(wordUp);
        if (GlobalVal === undefined) continue;
        msgList.push(globalVal2Msg(fsPath, GlobalVal));
    }
    return msgList.length === 0
        ? null
        : new vscode.MarkdownString(msgList.join('\n\n'), true);
}
