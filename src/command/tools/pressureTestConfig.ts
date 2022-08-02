import * as vscode from 'vscode';

export type TPickReturn = {
    label: string;
    delay: number;
    maxTime: number;
};

export function pressureTestConfig(): Thenable<TPickReturn | undefined> {
    const items: TPickReturn[] = [
        {
            label: '8 sec (base + DA)',
            delay: 400, // 173~250
            maxTime: 20, // 8 * 1000 / 400
            //              sec   ms    delay
        },
        {
            label: '32 sec (base + DA)',
            delay: 400,
            maxTime: 80,
        },
    ];

    return vscode.window.showQuickPick<TPickReturn>(items);
}
