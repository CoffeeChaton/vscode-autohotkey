import * as vscode from 'vscode';
import { CAhkSwitch } from '../../AhkSymbol/CAhkSwitch';
import type { TAhkSymbolList } from '../../AhkSymbol/TAhkSymbolIn';
import { pm } from '../../core/ProjectManager';

function searchAST(AST: Readonly<TAhkSymbolList>, position: vscode.Position): CAhkSwitch[] {
    const result: CAhkSwitch[] = [];
    for (const sw of AST) {
        if (sw.range.contains(position)) {
            if (sw instanceof CAhkSwitch) {
                result.push(sw);
                for (const caseOrDefault of sw.children) {
                    // eslint-disable-next-line max-depth
                    if (caseOrDefault.selectionRange.contains(position)) return result;
                }
            }
            result.push(...searchAST(sw.children, position));
        }
    }
    return result;
}

export function getDefSwitch(
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUp: string,
): vscode.Location[] | null {
    if (!(wordUp === 'CASE' || wordUp === 'DEFAULT')) return null;
    const { DocStrMap, AST } = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);

    const AhkTokenLine = DocStrMap[position.line];
    const { fistWordUp, fistWordUpCol } = AhkTokenLine;

    if (!(fistWordUp === 'CASE' || fistWordUp === 'DEFAULT')) return null;
    if (position.character > fistWordUpCol + fistWordUp.length) return null;

    const sw: CAhkSwitch | undefined = searchAST(AST, position).at(-1);
    if (sw === undefined) return null;

    return [
        new vscode.Location(
            document.uri,
            sw.selectionRange,
        ),
    ];
}
