/* eslint-disable @typescript-eslint/restrict-template-expressions */

export function enumErr(params: never): never {
    throw new Error(`enum err${params}--03--91--34`);
}

export function enumLog(params: never): null {
    console.log('enumLog ~ params', params);
    return null;
}
