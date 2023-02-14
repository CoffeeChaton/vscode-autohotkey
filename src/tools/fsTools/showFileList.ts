export function showFileList(fsPathList: string[]): string {
    return [
        '[\n',
        '    ',
        fsPathList.map((fsPath: string, i: number): string => `${i + 1}: "${fsPath}"`).join('\n    '),
        '\n]',
    ].join('');
}
