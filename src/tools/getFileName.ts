export function getFileName(fsPath: string): string {
    const i = fsPath.lastIndexOf('\\');
    return i === -1
        ? fsPath
        : fsPath.substring(i + 1);
}
