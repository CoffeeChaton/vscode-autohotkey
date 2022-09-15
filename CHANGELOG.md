# Changelog

## NEXT 0.0.7(2022-09-21)

### 1. fix semantic-highlight of `value name` === `keyword`

![img](image/CHANGELOG/v0-0-7-fix-semantic-highlight.png)

theme from [One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme), example code from [VA.ahk](https://github.com/ahkscript/VistaAudio/blob/master/VA.ahk#L465)

### 2. add Diag `c506` of not support number formats [number](https://www.autohotkey.com/docs/Concepts.htm#numbers)

> base10 `99` == base2 `0b1100011` == base8 `0o143` , but ahk v1 just support base10 base16
>
> AutoHotkey supports these number formats:
>
> - Decimal integers, such as `123`, `00123` or `-1`.
> - Hexadecimal integers, such as `0x7B`, `0x007B` or `-0x1`.
> - Decimal floating-point numbers, such as `3.14159`.

### 3. Better highlight of Numbers

![img](image/CHANGELOG/v0-0-7-highlight-of-Numbers.png)

- theme from [One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme)
- `0x` and `e` use `keyword.other.unit`
- other number ex `123` `007B` use `constant.numeric`
- exp of your `settings.json` ReadMore of [highlighting](https://code.visualstudio.com/docs/getstarted/themes#_editor-syntax-highlighting)

```jsonc
"editor.tokenColorCustomizations": {
    "textMateRules": [
        {
            "scope": "keyword.other.unit",
            "settings": {
                "foreground": "#D19A66"
            },
        },
        {
            "scope": "constant.numeric",
            "settings": {
                "foreground": "#D19A66",
            }
        }
    ]
}
```

## 0.0.6(2022-09-14)

<details>

- add Diag `c302` of `Function name too long, name len > (255 -2) characters.`
- add Diag `c505` of `param parsed Error -> unknown style`
- add Completion of `#Include`
  ![Completion of Include](image/Completion_Include.gif)

- Fix: highlight of number
- Fix: hover of `#Include`
- Fix: until neko-help activate then show `explorer/context`
- Fix: add ahk-doc type color

```js
/**
 * @param {Object} options some msg
 *         ^ Fix: add ahk-doc type color
 */
```

</details>

## 0.0.5(2022-09-05)

- add [note](./note/README.md)
- add diag of [multi-line](https://www.autohotkey.com/docs/Scripts.htm#continuation)
  1. join > 15char
  2. unknown option of multi-line

## 0.0.4(2022-08-27)

- add option of `AhkNekoHelp.snippets.Command`
- add Command of `List #Include Tree`
- fix highlight of `#include exp.ahk`
- fix highlight of [multi-line](https://www.autohotkey.com/docs/Scripts.htm#continuation)
- style: config use markdown

## 0.0.3(2022-08-13)

- add option of `code500 error` flag
- add option of `useSymBolProvider` flag
- add highlight `;@ahk-neko-ignore`
- add highlight `;@ahk-neko-ignore-fn`
- add auto hide `;@ahk-neko-ignore-fn`
- dev: move `displayErr` from `baseDiag` to `TAhkTokenLine`

## 0.0.2(2022-08-08)

1. disambiguation, change `;@ahk-ignore` -> `;@ahk-neko-ignore`

## 0.0.1(2022-08-02)

[release to vscode market](https://marketplace.visualstudio.com/items?itemName=cat1122.vscode-autohotkey-neko-help)

## 0.0.0(2020-04-05)

- fork from [cweijan/vscode-autohotkey](https://github.com/cweijan/vscode-autohotkey)
