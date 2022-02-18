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
        case EDiagCode.code901: return EDiagMsg.code901;
        case EDiagCode.code902: return EDiagMsg.code902;
        case EDiagCode.code903: return EDiagMsg.code903;
        default: return enumErr(value);
    }
}

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
