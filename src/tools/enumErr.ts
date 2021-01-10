export function enumErr(params: never): never {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`enum err${params}`);
}
