import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { RefLike2Location } from '../../provider/Def/getFnRef';

// --------

export async function AnalyzeFuncRef(uri: vscode.Uri, position: vscode.Position, funcSymbol: CAhkFunc): Promise<void> {
    //  console.log('funcSymbol', funcSymbol);

    await vscode.commands.executeCommand(
        'editor.action.peekLocations',
        uri,
        position,
        [...RefLike2Location(funcSymbol)],
        'goto',
        'not-Reference',
    );
}

export type TAnalyzeFuncRef = Parameters<typeof AnalyzeFuncRef>;
// 'executeReferenceProvider'
