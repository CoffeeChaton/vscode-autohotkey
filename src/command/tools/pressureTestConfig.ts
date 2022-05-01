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

export function pressureTestConfig(): Thenable<TPickReturn | undefined> {
    const items: TPickReturn[] = [
        {
            label: '8 sec (base + DA)',
            delay: 400, // 173~250
            maxTime: 20, // 8 * 1000 / 400
            //              sec   ms    delay
            mode: EPressureTestMode.baseAndDA,
        },
        {
            label: '32 sec (base + DA)',
            delay: 400,
            maxTime: 80,
            //              sec   ms    delay
            mode: EPressureTestMode.baseAndDA,
        },
    ];

    return vscode.window.showQuickPick<TPickReturn>(items);
}
