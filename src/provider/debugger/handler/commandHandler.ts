/* eslint-disable promise/avoid-new */
import { DebugServer } from '../debugServer';
import { TDbgpResponse } from '../DebugTypeEnum';

type TFn = (response: TDbgpResponse) => void;

function setCommandRun(transId: number, command: string, data?: string): string {
    const command1 = `${command} -i ${transId}`;
    const command2 = (!data)
        ? command1
        : `${command1} -- ${Buffer.from(data).toString('base64')}`;
    return `${command2}\x00`;
}

export class CommandHandler {
    private transId = 1;

    private readonly commandCallback = new Map<string, TFn>();

    private readonly debugServer: DebugServer;

    public constructor(setDebugServer: DebugServer) {
        this.debugServer = setDebugServer;
    }

    public async sendComand(command: string, data?: string): Promise<TDbgpResponse> {
        this.transId++;
        const commandRun: string = setCommandRun(this.transId, command, data);
        this.debugServer.write(commandRun);

        const needAwait = await new Promise<TDbgpResponse>((resolve): void => {
            const key = `${this.transId}`;
            const value: TFn = (response: TDbgpResponse): void => {
                resolve(response);
            };
            this.commandCallback.set(key, value);
        });
        return needAwait;
    }

    public fnCallback(transId: string, response: TDbgpResponse): void {
        const fun: TFn | undefined = this.commandCallback.get(transId);
        if (fun !== undefined) fun(response);
        this.commandCallback.delete(transId);
    }
}
