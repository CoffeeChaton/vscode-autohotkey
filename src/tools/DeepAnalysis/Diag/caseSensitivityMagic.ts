import * as vscode from 'vscode';

/**
 * // var "A" is the same variable as "a" defined earlier (at [165, 20])
 * // param "dDC" is the some variable as "ddc" defined earlier (at [221, 8])
 * Keep this format string!!!
 * WARN !!!!
 */

export function setDiagCaseMsg(firstName: string, defPos: vscode.Position, c502Name: string, prefix: string): string {
    const defPosStr = `[${defPos.line + 1}, ${defPos.character + 1}]`;
    // var "A" is the same variable as "a" defined earlier (at [165, 20])
    return `${prefix} "${c502Name}" is the some variable as "${firstName}" defined earlier (at ${defPosStr})`;
}

export type TParseDiagCaseMsg = {
    defStr: string;
    defRange: vscode.Range;
    refStr: string;
    refRange: vscode.Range;
};

export function ParseDiagCaseMsg(diag: vscode.Diagnostic): TParseDiagCaseMsg {
    const { message } = diag;
    //  var "A" is the same variable as "a" defined earlier (at [165, 20])
    const magStrList: string[] = [];
    for (const temp0 of [...message.matchAll(/"(\w+)"/uig)]) {
        magStrList.push(temp0[1]);
    }
    // magStrList like ["A","a"]
    const lineExec: RegExpExecArray | null = (/\[(\d+)/ui).exec(message);
    const charExec: RegExpExecArray | null = (/(\d+)\]/ui).exec(message);
    // eslint-disable-next-line no-magic-numbers
    if (magStrList.length !== 2 || lineExec === null || charExec === null) {
        void vscode.window.showErrorMessage(`ParseDiagCaseMsg error: ${message}`);
        throw new Error(`ParseDiagCaseMsg Err--59--12--14,diag is ${diag}`);
    }

    const radix = 10;
    const defLine: number = parseInt(lineExec[1], radix) - 1;
    const defChar: number = parseInt(charExec[1], radix) - 1;

    const defStr: string = magStrList[1];
    const refStr: string = magStrList[0];
    const defRange: vscode.Range = new vscode.Range(defLine, defChar, defLine, defChar + defStr.length);

    const refRange = diag.range;

    return {
        defStr,
        refStr,
        defRange,
        refRange,
    } as const;
}
