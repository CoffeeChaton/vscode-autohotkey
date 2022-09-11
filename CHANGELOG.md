# Changelog

## NEXT 0.0.6(2022-09-12)

- add Diag `c505` of `param parsed Error -> unknown style`
- add Completion of `#Include`
  ![Completion of Include](image/Completion_Include.gif)

- Fix: hover of `#Include`
- Fix: until neko-help activate then show `explorer/context`
- Fix: add ahk-doc type color

```js
/**
 * @param {Object} options some msg
 *         ^ Fix: add ahk-doc type color
 */
```

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
