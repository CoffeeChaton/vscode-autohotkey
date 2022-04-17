export const enum ESnippetRecBecause {
    paramNeverUsed = 'param is assigned but never used.\n\n',
    paramStartWith = 'param start with(Case Sensitive)\n\n',
    varDefNear = 'Def within the 5 lines\n\n',
    varRefNear = 'Ref within the 5 lines\n\n',
    varStartWith = 'var start with(Case Sensitive)\n\n',
}

export type TKeyRawName = string;
export type TSnippetRecMap = Map<TKeyRawName, ESnippetRecBecause>;
