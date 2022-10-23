import * as vscode from 'vscode';
import type { TTokenStream } from '../../globalEnum';
import { getHotkeyData } from '../../tools/Command/HotkeyTools';
import { getSetTimerData } from '../../tools/Command/SetTimerTools';
import type { TScanData } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import type { TSemanticTokensLeaf } from './tools';

type TCommandHighlightParam = { lStr: string; line: number; Tokens: TSemanticTokensLeaf[]; fistWordUpCol: number };

function SetTimerHighlight({
    lStr,
    line,
    Tokens,
    fistWordUpCol,
}: TCommandHighlightParam): void {
    // SetTimer , Label_or_fnName, PeriodOnOffDelete, Priority
    const setTimerData: TScanData | null = getSetTimerData(lStr, fistWordUpCol);
    if (setTimerData === null) return;

    const { RawNameNew, lPos } = setTimerData;

    const range: vscode.Range = new vscode.Range(
        new vscode.Position(line, lPos),
        new vscode.Position(line, lPos + RawNameNew.length),
    );

    Tokens.push({
        range,
        tokenType: 'function',
        tokenModifiers: [],
    });
}

function HotkeyHighlight({
    lStr,
    line,
    Tokens,
    fistWordUpCol,
}: TCommandHighlightParam): void {
    const HotkeyData: TScanData | null = getHotkeyData(lStr, fistWordUpCol);
    if (HotkeyData === null) return;

    const { RawNameNew, lPos } = HotkeyData;

    const range: vscode.Range = new vscode.Range(
        new vscode.Position(line, lPos),
        new vscode.Position(line, lPos + RawNameNew.length),
    );

    const isKeyword: boolean = (/^(?:On|Off|Toggle|AltTab)$/ui).test(RawNameNew);
    // On: The hotkey becomes enabled. No action is taken if the hotkey is already On.
    // Off: The hotkey becomes disabled. No action is taken if the hotkey is already Off.
    // Toggle: The hotkey is set to the opposite state (enabled or disabled).
    // AltTab (and others): These are special Alt-Tab hotkey actions that are described here.
    // WTF ... ahk is too many cases ...

    Tokens.push({
        range,
        tokenType: isKeyword
            ? 'keyword'
            : 'function', // label .... ahk.tmLanguage.json is user "entity.name.function.label.ahk"
        tokenModifiers: [],
    });
}

export function funcHighlight(DocStrMap: TTokenStream): TSemanticTokensLeaf[] {
    const Tokens: TSemanticTokensLeaf[] = [];

    for (
        const {
            line,
            lStr,
            fistWordUp,
            fistWordUpCol,
        } of DocStrMap
    ) {
        // TODO of fistWordUp is case/default
        if (fistWordUp === 'HOTKEY') {
            HotkeyHighlight({
                lStr,
                line,
                Tokens,
                fistWordUpCol,
            });
        } else if (fistWordUp === 'SETTIMER') {
            SetTimerHighlight({
                lStr,
                line,
                Tokens,
                fistWordUpCol,
            });
        }
    }

    return Tokens;
}
