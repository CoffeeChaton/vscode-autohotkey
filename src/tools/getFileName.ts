/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,10000] }] */
export function getFileName(fsPath: string): string {
    const i = fsPath.lastIndexOf('\\');
    return i === -1
        ? fsPath
        : fsPath.substring(i + 1);
}
