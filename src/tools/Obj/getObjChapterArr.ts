export function getObjChapterArr(textRaw: string, character: number): readonly string[] | null {
    if (character === 0) return null;

    const textLPart: string = textRaw.substring(0, character);

    const ma: RegExpMatchArray | null = textLPart.match(/([\w.]+)$/u);
    if (ma === null) return null;
    const ChapterList: string[] = ma[1].split('.');
    ChapterList.pop();

    if (ChapterList.length === 0) return null;

    if ((/^\d+$/ui).test(ChapterList[0])) return null; // ex: 0.5

    return ChapterList;
}
