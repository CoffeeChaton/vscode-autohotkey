import * as vscode from 'vscode';
import { CAhkClass, CAhkClassGetSet, CAhkClassInstanceVar } from '../../../AhkSymbol/CAhkClass';
import { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { TAstRoot, TTopSymbol } from '../../../AhkSymbol/TAhkSymbolIn';
import { pm } from '../../../core/ProjectManager';
import { getDAWithPos } from '../../../tools/DeepAnalysis/getDAWithPos';
import type { TAllClassMap } from '../../../tools/getAllClass';
import { getAllClass } from '../../../tools/getAllClass';
import { isPosAtMethodName } from '../../Def/isPosAtMethodName';

function getClassWithPos(
    AstRoot: TAstRoot,
    position: vscode.Position,
): CAhkClass | null {
    const TopSymbol: TTopSymbol | undefined = AstRoot.find((top: TTopSymbol): boolean => top.range.contains(position));
    if (TopSymbol instanceof CAhkClass) return TopSymbol;

    return null;
}

function makeClassMD(ahkClass: CAhkClass, firstLineStr: string): vscode.MarkdownString {
    const md: vscode.MarkdownString = new vscode.MarkdownString(firstLineStr, true);

    const extendsStr = ahkClass.Base === ''
        ? ''
        : ` extends ${ahkClass.Base}`;
    md.appendCodeblock(`Class ${ahkClass.name} ${extendsStr} {`);

    for (const ch of ahkClass.children) {
        //  CAhkClass | CAhkClassGetSet | CAhkClassInstanceVar | CAhkFunc;
        if (ch instanceof CAhkClass) {
            md.appendCodeblock(`    class ${ch.name} ;`);
        } else if (ch instanceof CAhkClassGetSet) {
            md.appendCodeblock(`    ${ch.name}[] ; Properties`);
        } else if (ch instanceof CAhkClassInstanceVar) {
            if (ch.detail === 'static ClassVar') {
                md.appendCodeblock(`    static ${ch.name} ;...`);
            } else {
                md.appendCodeblock(`    ${ch.name} := ... ; Instance Var`);
            }
        } else if (ch instanceof CAhkFunc) {
            md.appendCodeblock(`    ${ch.name}() ; Method`);
        }
    }
    md.appendCodeblock('}');

    return md;
}

export function hoverClassName(
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUp: string,
): vscode.MarkdownString | null {
    const { AST, DocStrMap } = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);

    if (isPosAtMethodName(getDAWithPos(AST, position), position)) {
        return null;
    }

    const topClass: CAhkClass | null = getClassWithPos(AST, position);
    if (topClass !== null) {
        if (topClass.selectionRange.contains(position)) {
            return makeClassMD(topClass, 'Top Class');
        }

        const { fistWordUp } = DocStrMap[position.line];
        if (fistWordUp === 'CLASS') {
            return new vscode.MarkdownString('Nested class', true);
        }

        // if (topClass.selectionRange.start.line === position.line) {
        //     // classMap ... nothing
        //     // class ClassName extends BaseClassName
        //     //                          ^
        // }
    }

    const classMap: TAllClassMap = getAllClass();
    const classDef: CAhkClass | undefined = classMap.get(wordUp);
    if (classDef === undefined) {
        return null;
    }

    return makeClassMD(classDef, 'maybe is this class ?');
}
