/* eslint-disable immutable/no-this */
/* eslint-disable immutable/no-mutation */
import { EventEmitter } from 'events';
import * as Net from 'net';
import * as xml2js from 'xml2js';

const enum Enum {
    END = 0,
    HEADER = '<?xml version="1.0" encoding="UTF-8"?>',
}
/**
 * Exchange dbgp protocol with ahk debug proxy.
 */
export class DebugServer extends EventEmitter {
    private proxyConnection: Net.Socket | null = null;

    private readonly proxyServer: Net.Server;

    private readonly port: number;

    private readonly parser = new xml2js.Parser({
        attrkey: 'attr',
        charsAsChildren: false,
        charkey: 'content',
        explicitCharkey: true,
        explicitArray: false,
        //
        // emptyTag: 'neko-undefine', // undefine -> str
        strict: true,
    });

    public constructor(port: number) {
        super();
        this.port = port;

        let tempData: Buffer | null = null;
        this.proxyServer = new Net.Server()
            .listen(this.port)
            .on('connection', (socket: Net.Socket) => {
                this.proxyConnection = socket;
                socket.on('data', (chunk) => {
                    tempData = tempData
                        ? Buffer.concat([tempData, chunk])
                        : chunk;
                    if (tempData[tempData.length - 1] === Enum.END) {
                        this.process(tempData.toString());
                        tempData = null;
                    }
                });
            })
            .on('error', (err: Error) => {
                console.error('DebugServer ~ .on ~ --36--71--23--by-neko-help', err);
                throw err;
            });
    }

    public shutdown(): void {
        if (this.proxyConnection) this.proxyConnection.end();
        this.proxyServer.close();
    }

    public write(data: string): void {
        if (this.proxyConnection) this.proxyConnection.write(data);
    }

    public process(data: string): void {
        const data1 = data.substring(data.indexOf('<?xml'));
        const data2 = (data1.indexOf(Enum.HEADER) === -1)
            ? Enum.HEADER + data1
            : data1;
        const dataList = data2.split(Enum.HEADER);
        dataList.forEach((part: string) => {
            if (part.trim() === '') return;

            const xmlString = Enum.HEADER + part;
            this.parser.parseStringPromise(xmlString)
                .then((res: Record<string, unknown>): null => {
                    if (typeof res === 'object' && res !== null) {
                        for (const key in res) {
                            if (Object.prototype.hasOwnProperty.call(res, key)) {
                                this.emit(key, res[key]);
                            }
                        }
                        return null;
                    }
                    throw new Error('parseStringPromise Err --90--83--771');
                })
                .catch((err: Error) => {
                    console.error('DebugServer ~ process ~ err --31--55--117 by--neko-help', err);
                });
        });
    }
}
