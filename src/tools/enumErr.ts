import { OutputChannel } from '../provider/vscWindows/OutputChannel';

export class CEnumError extends Error {
    public constructor(fnName: string) {
        super(`enumLog - ${fnName}`);

        this.name = 'CEnumError';
    }
}

export function enumLog(params: never, fnName: string): void {
    console.log('enumLog ~ params', params);
    OutputChannel.appendLine('enumLog ~ params');
    OutputChannel.show();
    throw new CEnumError(fnName);
}
