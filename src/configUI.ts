/* eslint-disable max-statements */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3] }] */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/prefer-default-export */
import * as vscode from 'vscode';
import { Detecter } from './core/Detecter';
// TODO
const versionValue = 'v0.32, ';
const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
statusBarItem.tooltip = 'this extensions by CoffeeChaton/vscode-ahk-outline';
let configuration = vscode.workspace.getConfiguration('AhkOutline.statusBar');
let configs = [
  configuration.get('showVersion') as boolean,
  configuration.get('showTime') as boolean,
  configuration.get('showFileName') as boolean,
  configuration.get('displayColor') as string,
];
let version = configs[0] ? versionValue : '';
let color = configs[3];


export function configChangEvent(): void {
  configuration = vscode.workspace.getConfiguration('AhkOutline.statusBar');
  configs = [
    configuration.get('showVersion') as boolean,
    configuration.get('showTime') as boolean,
    configuration.get('showFileName') as boolean,
    configuration.get('displayColor') as string,
  ];
  // TODO for of


  version = configs[0] ? versionValue : '';
  // color = configs[3];
  [, , , color] = configs;
}

export function showTimeSpend(path: string, timeStart: number): void {
  const timeSpend = configs[1] ? `${Date.now() - timeStart} ms` : '';
  const name = configs[2]
    ? `, ${path.substring(Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\')) + 1, path.length)}`
    : '';
  statusBarItem.text = `$(ruby) ${version}${timeSpend}${name}`;
  statusBarItem.command = 'AhkOutline.statusBar.Click'; //  TODO statusBarItem.command
  statusBarItem.color = color;
  statusBarItem.show();
}
export function statusBarClick() {
  vscode.window.showWarningMessage('AhkOutline.statusBar.Click TEST');
  // const options: vscode.InputBoxOptions = {
  //   value: '--TEST--',
  //   valueSelection: [0, 10],
  //   prompt: ' The text to display underneath the input box.',
  //   placeHolder: 'placeHolder.......',
  // };
  // const temp = await vscode.window.showInputBox(options);// TODO statusBarClick can set tab size
  // const temp2 = temp.then();
  // if (temp2) vscode.window.showWarningMessage();
}
// statusBarItem.command = 'projectManager.listProjects';
//  statusBarItem.dispose();//
// vscode.window.showInformationMessage(timeSpend);
// vscode.window.showWarningMessage(timeSpend);
// const a = vscode.window.createOutputChannel(version);
// a.show();
// a.appendLine(timeSpend);
// console.log(timeSpend);
// vscode.window.setStatusBarMessage(timeSpend);
