import { removeBigParentheses } from './removeBigParentheses';
import { removeParentheses } from './removeParentheses';
/*
class CLineVal {
    public valName: string;

    public valDefLoc: vscode.Location;

    public valType: EValType;

    public valRText: string | null; // := ""

    public valLineComment: string | null; // ;;comment

    public valHoverMd: vscode.MarkdownString;

}
*/
export function getLineValDef(lStr: string): string[] {
    const lStrFix = lStr.replace(/^\s*(local|global|static)\s/i, '');
    return removeParentheses(removeBigParentheses(lStrFix))
        .split(',')
        .map((str) => {
            const col = str.indexOf(':='); // just support :=
            return (col > 0) ? str.substring(0, col).trim() : str;
        });
}
