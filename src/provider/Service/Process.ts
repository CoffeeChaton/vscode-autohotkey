/* eslint-disable promise/avoid-new */
import * as child_process from 'child_process';

type TOpt = child_process.ExecOptions;

export async function Process(command: string, opt: TOpt): Promise<boolean> {
    return new Promise((resolve, reject) => {
        child_process.exec(command, opt, (error) => {
            if (error) {
                console.log('child_process.exec ~ error', error);
                reject(error);
                return;
            }
            resolve(true);
        });
    });
}

export function ProcessSync(command: string, options: TOpt): boolean {
    const ed = child_process.execSync(command, options);
    if (ed) {
        console.log('ProcessSync ~ ed true', ed);
        return true;
    }
    return false;
}
