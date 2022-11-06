import { OutputChannel } from '../provider/vscWindows/OutputChannel';

export function enumLog(params: never): void {
    console.log('enumLog ~ params', params);
    OutputChannel.appendLine('enumLog ~ params');
    OutputChannel.show();
    throw new Error('enumLog');
}
