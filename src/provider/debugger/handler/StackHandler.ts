import { Source, StackFrame } from '@vscode/debugadapter';
import { DebugProtocol } from '@vscode/debugprotocol';
import { basename } from 'path';
import { TDbgpResponse } from '../DebugTypeEnum';

export function StackHandler(args: DebugProtocol.StackTraceArguments, response: TDbgpResponse): StackFrame[] {
    if (!response) return [];

    const tempStack = response.stack;
    const stackList = Array.isArray(tempStack)
        ? tempStack
        : Array.of(tempStack);

    return stackList.map((stack, i: number) => {
        const nm: string = stack.attr.where;
        const path: string = stack.attr.filename;
        const name: string = basename(path);
        const src: Source = new Source(name, path);
        const ln: number = parseInt(stack.attr.lineno, 10);
        return new StackFrame(i, nm, src, ln);
    });
}
