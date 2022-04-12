import * as vscode from 'vscode';
import { NekoDebugSession } from './NekoDebugSession';

export const NekoDebugMain: vscode.DebugAdapterDescriptorFactory = {
    createDebugAdapterDescriptor(
        _session: vscode.DebugSession,
    ): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
        return new vscode.DebugAdapterInlineImplementation(new NekoDebugSession());
    },
};
