/* eslint-disable @typescript-eslint/no-unused-vars */
import * as vscode from 'vscode';
import { NekoDebugSession } from './NekoDebugSession';

export class NekoDebugMain implements vscode.DebugAdapterDescriptorFactory {
    public createDebugAdapterDescriptor(session: vscode.DebugSession): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
        console.log('NekoDebugMain ~ createDebugAdapterDescriptor ~ session', session);
        return new vscode.DebugAdapterInlineImplementation(new NekoDebugSession());
    }
}
