/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3,4] }] */
import * as vscode from 'vscode';

const fnTest = (chapter: string): boolean => chapter === '' || (/^\d+$/).test(chapter);

export function getObjChapterArr(document: vscode.TextDocument, position: vscode.Position): readonly string[] | null {
    /*
    a common trigger character is . to trigger member completions.
    */
    const textRaw = document.lineAt(position).text;

    if (position.character === 0) return null;
    const textLPart = textRaw.substring(0, position.character);
    const ChapterArr: string[] = [];
    let chapter = '';

    if (textLPart.length - 2 < 0) return null;
    for (let i = textLPart.length - 2; i > -1; i--) {
        if (textLPart[i] === ' ' || textLPart[i] === '=') {
            if (fnTest(chapter)) return null;
            ChapterArr.push(chapter);
            chapter = '';
            break;
        } else if (textLPart[i] === '.') {
            if (fnTest(chapter)) return null;
            ChapterArr.push(chapter);
            chapter = '';
        } else {
            if (!(/^\w$/).test(textLPart[i])) return null;
            chapter = `${textLPart[i]}${chapter}`;
        }

        if (i === 0) {
            if (fnTest(chapter)) return null;
            ChapterArr.push(chapter);
            chapter = '';
        }
    }

    if (ChapterArr.length === 0) return null;
    ChapterArr.reverse();
    const chapterHead = ChapterArr[0];

    if (chapterHead === '') return null;
    return ChapterArr;
}
