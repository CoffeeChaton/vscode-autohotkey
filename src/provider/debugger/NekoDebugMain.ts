/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import * as vscode from 'vscode';
import { NekoDebugSession } from './NekoDebugSession';

export class NekoDebugMain implements vscode.DebugAdapterDescriptorFactory {
    public createDebugAdapterDescriptor(
        _session: vscode.DebugSession,
    ): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
        return new vscode.DebugAdapterInlineImplementation(new NekoDebugSession());
    }
}
