import * as vscode from 'vscode';

export const enum EPrefixC502 {
    var = 'var',
    param = 'param',
}

/**
 * // var "A" is the same variable as "a" defined earlier (at [165, 20])
 * // param "dDC" is the some variable as "ddc" defined earlier (at [221, 8])
 * Keep this format string!!!
 * WARN !!!!
 */
export function setDiagCaseMsg(
    firstName: string,
    defPos: vscode.Position,
    c502Name: string,
    prefix: EPrefixC502,
): string {
    const defPosStr = `[${defPos.line + 1}, ${defPos.character + 1}]`;
    // var "A" is the same variable as "a" defined earlier (at [165, 20])
    return `${prefix} "${c502Name}" is the some variable as "${firstName}" defined earlier (at ${defPosStr})`;
}

export type TParseDiagCaseMsg = Readonly<{
    defStr: string;
    defRange: vscode.Range;
    refStr: string;
    refRange: vscode.Range;
}>;

export function ParseDiagCaseMsg(diag: vscode.Diagnostic): TParseDiagCaseMsg {
    const { message, range } = diag;
    //  var "A" is the same variable as "a" defined earlier (at [165, 20])
    const magStrList: string[] = [];
    for (const temp0 of message.matchAll(/"(\w+)"/uig)) {
        magStrList.push(temp0[1]);
    }

    // magStrList like ["A","a"]
    const lineMatch: RegExpMatchArray | null = message.match(/\[(\d+)/ui);
    const charMatch: RegExpMatchArray | null = message.match(/(\d+)\]/ui);

    if (magStrList.length !== 2 || lineMatch === null || charMatch === null) {
        void vscode.window.showErrorMessage(`ParseDiagCaseMsg error: ${message}`);
        throw new Error(`ParseDiagCaseMsg Err--59--12--14,diag is ${message}`);
    }

    const radix = 10;
    const defLine: number = Number.parseInt(lineMatch[1], radix) - 1;
    const defChar: number = Number.parseInt(charMatch[1], radix) - 1;

    const defStr: string = magStrList[1];
    const refStr: string = magStrList[0];
    const defRange: vscode.Range = new vscode.Range(defLine, defChar, defLine, defChar + defStr.length);

    return {
        defStr,
        refStr,
        defRange,
        refRange: range,
    };
}
