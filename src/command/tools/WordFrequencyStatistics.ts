import { OutputChannel } from '../../provider/vscWindows/OutputChannel';
import { TDAMeta, TTextMeta } from '../../tools/DeepAnalysis/TypeFnMeta';

export type TWordFrequencyStatistics = {
    paramMapSize: number;
    valMapSize: number;
    textMapSize: number;
    topFuncNum: number;
};
// WordFrequencyStatistics
export function WordFrequencyStatistics(need: TDAMeta[]): TWordFrequencyStatistics {
    let paramMapSize = 0;
    let valMapSize = 0;
    let textMapSize = 0;
    const DEB: Map<string, number> = new Map();
    need.forEach((ed: TDAMeta): void => {
        paramMapSize += ed.paramMap.size;
        valMapSize += ed.valMap.size;
        textMapSize += ed.textMap.size;
        ed.textMap.forEach((v: TTextMeta, k: string): void => {
            const oldNum: number = DEB.get(k) ?? 0;
            DEB.set(k, oldNum + v.refRangeList.length);
        });
    });

    type TElement = {
        k: string;
        v: number;
    };
    const e5: TElement[] = [];
    for (const [k, v] of DEB) {
        // eslint-disable-next-line no-magic-numbers
        if (v > 20) {
            e5.push({ k, v });
        }
    }
    e5.sort((a: TElement, b: TElement): number => b.v - a.v);
    OutputChannel.clear();
    OutputChannel.appendLine('------>>>------this package: unknown Word frequency statistics----->>>-----');
    for (const { k, v } of e5) { //
        OutputChannel.appendLine(`${k}: ${v}`);
    }
    OutputChannel.appendLine('------<<<------this package: unknown Word frequency statistics-----<<<-----');

    return {
        paramMapSize,
        valMapSize,
        textMapSize,
        topFuncNum: need.length,
    };
}

// V: 86
// -> Functions.ahk
// -> ex: "ControlGet, v, %Cmd%, %Value%, %Control%, %WinTitle%, %WinText%, %ExcludeTitle%, %ExcludeText%"

// PointsF: 35
// -> Gdip_all_2020_08_24
// -> ByRef
// -> ex: "   iCount := CreatePointsF(PointsF, Points)"
// -> ex: CreatePointsF(ByRef PointsF, inPoints)

// WIDTH: 30, HEIGHT: 29
// -> Gdip_all_2020_08_24
// -> ByRef
// -> Gdip_GetImageDimensions(pBitmap, Width, Height)
// -> ex: "Gdip_GetImageDimensions(pBitmap, Width, Height)"

// W: 24
// -> Gdip_all_2020_08_24
// -> ByRef
// -> exp : "Gdip_GetImageDimensions(pBitmap, W, H)"

// pPath: 24
// -> Gdip_all_2020_08_24
// -> line 1062 -> Gdip_DrawRoundedRectanglePath(pGraphics, pPen, X, Y, W, H, R) {
// -> line 1063      ; Create a GraphicsPath
// -> line 1064     DllCall("Gdiplus.dll\GdipCreatePath", "UInt", 0, "PtrP", pPath)

// UP: 23
// "    send, {LCtrl Up}"
