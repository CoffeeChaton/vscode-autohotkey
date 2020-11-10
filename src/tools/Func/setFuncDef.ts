// import * as vscode from 'vscode';
// import { FuncInputType } from '../../core/getChildren';
// import { getRange } from '../getRange';
// import { getFnMode } from './getFnMode';
// import { getFuncDef } from './getFuncDef';
// import { MyFuncSymbol as ahkFuncSymbol } from './ahkFucObj';
// import { getSelectionRangeTextRaw } from './getSelectionRangeTextRaw';

// export function setFuncDef(FuncInput: FuncInputType): false | ahkFuncSymbol {
//     const {
//         DocStrMap, line, RangeEndLine, inClass, lStr,
//     } = FuncInput;

//     if (lStr === '') return false;
//     const isFunc = getFuncDef(DocStrMap, line);
//     if (isFunc === false) return false;

//     const { name, selectionRange } = isFunc;
//     const getDetail = (): string => {
//         if (line === 0) return '';
//         const PreviousLineText = DocStrMap[line - 1].textRaw.trimStart();
//         return PreviousLineText.startsWith(';@')
//             ? PreviousLineText.substring(2) // 2=== ';@'.len
//             : '';
//     };

//     const searchLine = selectionRange.end.line;
//     const Range = getRange(DocStrMap, line, searchLine, RangeEndLine);
//     const kind = inClass ? vscode.SymbolKind.Method : vscode.SymbolKind.Function;
//     const detail = getDetail();

//     const ahkFn: ahkFuncSymbol = new vscode.DocumentSymbol(name, detail, kind, Range, selectionRange);

//     const col = Math.max(selectionRange.start.character, lStr.indexOf('('));
//     const newPos = new vscode.Position(line, col);

//     ahkFn.mode = getFnMode(ahkFn, DocStrMap);
//     ahkFn.argsRange = new vscode.Range(newPos, selectionRange.end);
//     ahkFn.selectionRangeTextRaw = getSelectionRangeTextRaw(selectionRange, DocStrMap);
//     ahkFn.funcComment = null;
//     // args: TArgs;
//     // value: TValue,

//     return ahkFn;
// }
