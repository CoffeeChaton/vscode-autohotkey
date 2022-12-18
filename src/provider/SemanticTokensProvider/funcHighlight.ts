import * as vscode from 'vscode';
import type { TAhkTokenLine, TTokenStream } from '../../globalEnum';
import { getHotkeyWrap } from '../../tools/Command/HotkeyTools';
import { getSetTimerWrap } from '../../tools/Command/SetTimerTools';
import type { TScanData } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import type { TSemanticTokensLeaf } from './tools';

function SetTimerHighlight(AhkTokenLine: TAhkTokenLine, Tokens: TSemanticTokensLeaf[]): 0 | 1 {
    // SetTimer , Label_or_fnName, PeriodOnOffDelete, Priority

    const setTimerData: TScanData | null = getSetTimerWrap(AhkTokenLine);
    if (setTimerData === null) return 0;

    const { RawNameNew, lPos } = setTimerData;

    const { line } = AhkTokenLine;
    Tokens.push({
        range: new vscode.Range(
            new vscode.Position(line, lPos),
            new vscode.Position(line, lPos + RawNameNew.length),
        ),
        tokenType: 'function',
        tokenModifiers: [],
    });
    return 1;
}

function HotkeyHighlight(AhkTokenLine: TAhkTokenLine, Tokens: TSemanticTokensLeaf[]): 0 | 1 {
    // Hotkey, KeyName , Label, Options
    const HotkeyData: TScanData | null = getHotkeyWrap(AhkTokenLine);
    if (HotkeyData === null) return 0;

    const { RawNameNew, lPos } = HotkeyData;

    const { line } = AhkTokenLine;
    Tokens.push({
        range: new vscode.Range(
            new vscode.Position(line, lPos),
            new vscode.Position(line, lPos + RawNameNew.length),
        ),
        tokenType: (/^(?:On|Off|Toggle|AltTab)$/ui).test(RawNameNew)
            ? 'keyword'
            : 'function', // label .... ahk.tmLanguage.json is user "entity.name.function.label.ahk"
        tokenModifiers: [],
        // On: The hotkey becomes enabled. No action is taken if the hotkey is already On.
        // Off: The hotkey becomes disabled. No action is taken if the hotkey is already Off.
        // Toggle: The hotkey is set to the opposite state (enabled or disabled).
        // AltTab (and others): These are special Alt-Tab hotkey actions that are described here.
        // WTF ... ahk is too many cases ...
    });
    return 1;
}

export function funcHighlight(DocStrMap: TTokenStream): TSemanticTokensLeaf[] {
    const Tokens: TSemanticTokensLeaf[] = [];

    type TFn = (AhkTokenLine: TAhkTokenLine, Tokens: TSemanticTokensLeaf[]) => 0 | 1;
    const fnList: TFn[] = [SetTimerHighlight, HotkeyHighlight];

    for (const AhkTokenLine of DocStrMap) {
        for (const fn of fnList) {
            const result: 0 | 1 = fn(AhkTokenLine, Tokens);
            if (result === 1) break;
        }
    }

    return Tokens;
}
