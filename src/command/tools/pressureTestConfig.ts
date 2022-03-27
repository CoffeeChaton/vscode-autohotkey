import * as vscode from 'vscode';

export const enum EPressureTestMode {
    justBase = 1,
    // eslint-disable-next-line no-magic-numbers
    baseAndDA = 2,
}

export type TPickReturn = {
    label: string;
    delay: number;
    maxTime: number;
    mode: EPressureTestMode; // 1 is base , 2 is base+DA
};

export async function pressureTestConfig(): Promise<TPickReturn | null> {
    const items: TPickReturn[] = [
        {
            label: '10 sec (base)',
            delay: 100, // my test pack time 50~70
            maxTime: 100, // 10 * 1000 / 100
            //               sec   ms    delay
            mode: EPressureTestMode.justBase,
        },
        {
            label: '12 sec (base + DA)',
            delay: 600, // base 50~70 , DA 450~500 ms -> 70 + 500 -> 600
            maxTime: 20, // 12 * 1000 / 600
            //              sec   ms    delay
            mode: EPressureTestMode.baseAndDA,
        },
    ];

    const pick = await vscode.window.showQuickPick<TPickReturn>(items);
    if (pick === undefined) return null;

    return pick;
}
