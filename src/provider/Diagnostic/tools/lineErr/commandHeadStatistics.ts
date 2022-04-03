import { OutputChannel } from '../../../vscWindows/OutputChannel';

const DEB = new Map<string, number>();

const isDebug = false;

// not export now
// eslint-disable-next-line @typescript-eslint/naming-convention
function _commandHeadStatistics(commandHead: string): void {
    const hint: number = DEB.get(commandHead) ?? 0;
    DEB.set(commandHead, hint + 1);

    if (isDebug) {
        type TElement = {
            k: string;
            v: number;
        };
        const e5: TElement[] = [];
        for (const [k, v] of DEB) {
            // eslint-disable-next-line no-magic-numbers
            if (v > 10) {
                e5.push({ k, v });
            }
        }

        e5.sort((a: TElement, b: TElement): number => a.v - b.v);
        for (const { k, v } of e5) { //
            OutputChannel.appendLine(`${k}: ${v}`);
        }
        OutputChannel.show();
        console.log('🚀 ~ _commandHeadStatistics ~ e5', e5);
    }
}

// const e5 = [
//     {
//         k: 'SetTimer',
//         v: 12,
//     },
//     {
//         k: 'radius',
//         v: 18,
//     },
//     {
//         k: 'send',
//         v: 20,
//     },
//     {
//         k: 'SendInput',
//         v: 22,
//     },
//     {
//         k: 'MsgBox',
//         v: 22,
//     },
//     {
//         k: 'ToolTip',
//         v: 24,
//     },
//     {
//         k: 'static',
//         v: 26,
//     },
//     {
//         k: 'IniRead',
//         v: 30,
//     },
//     {
//         k: 'MouseClick',
//         v: 32,
//     },
//     {
//         k: 'IniWrite',
//         v: 40,
//     },
//     {
//         k: 'MouseMove',
//         v: 46,
//     },
//     {
//         k: 'Send',
//         v: 72,
//     },
// ];
