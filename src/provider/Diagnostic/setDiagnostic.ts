import * as vscode from 'vscode';
import {
    EDiagBase,
    EDiagCode,
    EDiagFsPath,
    EDiagMsg,
} from '../../globalEnum';
import { enumErr } from '../../tools/enumErr';

type TDigs = {
    message: EDiagMsg;
    target: vscode.Uri;
};

// eslint-disable-next-line complexity
function setMsg(value: EDiagCode): EDiagMsg {
    // dprint-ignore
    switch (value) {
        case EDiagCode.code107: return EDiagMsg.code107;
        case EDiagCode.code110: return EDiagMsg.code110;
        case EDiagCode.code111: return EDiagMsg.code111;
        case EDiagCode.code112: return EDiagMsg.code112;
        case EDiagCode.code113: return EDiagMsg.code113;
        case EDiagCode.code114: return EDiagMsg.code114;
        case EDiagCode.code201: return EDiagMsg.code201;
        case EDiagCode.code301: return EDiagMsg.code301;
        case EDiagCode.code501: return EDiagMsg.code501;
        case EDiagCode.code700: return EDiagMsg.code700;
        case EDiagCode.code801: return EDiagMsg.code801;
        case EDiagCode.code802: return EDiagMsg.code802;
        case EDiagCode.code803: return EDiagMsg.code803;
        case EDiagCode.code804: return EDiagMsg.code804;
        case EDiagCode.code805: return EDiagMsg.code805;
        case EDiagCode.code806: return EDiagMsg.code806;
        case EDiagCode.code807: return EDiagMsg.code807;
        case EDiagCode.code808: return EDiagMsg.code808;
        case EDiagCode.code809: return EDiagMsg.code809;
        case EDiagCode.code810: return EDiagMsg.code810;
        case EDiagCode.code811: return EDiagMsg.code811;
        case EDiagCode.code812: return EDiagMsg.code812;
        case EDiagCode.code813: return EDiagMsg.code813;
        case EDiagCode.code814: return EDiagMsg.code814;
        case EDiagCode.code815: return EDiagMsg.code815;
        case EDiagCode.code816: return EDiagMsg.code816;
        case EDiagCode.code817: return EDiagMsg.code817;
        case EDiagCode.code818: return EDiagMsg.code818;
        case EDiagCode.code819: return EDiagMsg.code819;
        case EDiagCode.code820: return EDiagMsg.code820;
        case EDiagCode.code821: return EDiagMsg.code821;
        case EDiagCode.code822: return EDiagMsg.code822;
        case EDiagCode.code823: return EDiagMsg.code823;
        case EDiagCode.code824: return EDiagMsg.code824;
        case EDiagCode.code901: return EDiagMsg.code901;
        case EDiagCode.code902: return EDiagMsg.code902;
        case EDiagCode.code903: return EDiagMsg.code903;
        default: return enumErr(value);
    }
}

// eslint-disable-next-line complexity
function setTargetRaw(value: EDiagCode): EDiagFsPath {
    // dprint-ignore
    switch (value) {
        case EDiagCode.code107: return EDiagFsPath.code107;
        case EDiagCode.code110: return EDiagFsPath.code110;
        case EDiagCode.code111: return EDiagFsPath.code111;
        case EDiagCode.code112: return EDiagFsPath.code112;
        case EDiagCode.code113: return EDiagFsPath.code113;
        case EDiagCode.code114: return EDiagFsPath.code114;
        case EDiagCode.code201: return EDiagFsPath.code201;
        case EDiagCode.code301: return EDiagFsPath.code301;
        case EDiagCode.code501: return EDiagFsPath.code501;
        case EDiagCode.code700: return EDiagFsPath.code700;
        case EDiagCode.code801: return EDiagFsPath.code801;
        case EDiagCode.code802: return EDiagFsPath.code802;
        case EDiagCode.code803: return EDiagFsPath.code803;
        case EDiagCode.code804: return EDiagFsPath.code804;
        case EDiagCode.code805: return EDiagFsPath.code805;
        case EDiagCode.code806: return EDiagFsPath.code806;
        case EDiagCode.code807: return EDiagFsPath.code807;
        case EDiagCode.code808: return EDiagFsPath.code808;
        case EDiagCode.code809: return EDiagFsPath.code809;
        case EDiagCode.code810: return EDiagFsPath.code810;
        case EDiagCode.code811: return EDiagFsPath.code811;
        case EDiagCode.code812: return EDiagFsPath.code812;
        case EDiagCode.code813: return EDiagFsPath.code813;
        case EDiagCode.code814: return EDiagFsPath.code814;
        case EDiagCode.code815: return EDiagFsPath.code815;
        case EDiagCode.code816: return EDiagFsPath.code816;
        case EDiagCode.code817: return EDiagFsPath.code817;
        case EDiagCode.code818: return EDiagFsPath.code818;
        case EDiagCode.code819: return EDiagFsPath.code819;
        case EDiagCode.code820: return EDiagFsPath.code820;
        case EDiagCode.code821: return EDiagFsPath.code821;
        case EDiagCode.code822: return EDiagFsPath.code822;
        case EDiagCode.code823: return EDiagFsPath.code823;
        case EDiagCode.code824: return EDiagFsPath.code824;
        case EDiagCode.code901: return EDiagFsPath.code901;
        case EDiagCode.code902: return EDiagFsPath.code902;
        case EDiagCode.code903: return EDiagFsPath.code903;
        default: return enumErr(value);
    }
}

function valueMapToDigs(value: EDiagCode): TDigs {
    return {
        message: setMsg(value),
        target: vscode.Uri.parse(setTargetRaw(value)),
    };
}

export function setDiagnostic(
    value: EDiagCode,
    range: vscode.Range,
    severity: vscode.DiagnosticSeverity,
    tags: vscode.DiagnosticTag[],
): vscode.Diagnostic {
    const { message, target } = valueMapToDigs(value);
    const diag1 = new vscode.Diagnostic(range, message, severity);
    diag1.source = EDiagBase.source;
    diag1.code = { value, target };
    diag1.tags = tags;
    return diag1;
}
