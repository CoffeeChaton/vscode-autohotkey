/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */
// eslint-disable-next-line import/no-unresolved
import * as vscode from 'vscode';
/* eslint-disable import/prefer-default-export */
const configuration = vscode.workspace.getConfiguration('AhkOutline');
const config = {
  displayTime: configuration.get('displayTime'),
  showVersion: configuration.get('showVersion'),
  displayFileName: configuration.get('displayFileName'),
};
const version = config.showVersion ? 'v0.32, ' : '';
const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
statusBarItem.tooltip = 'this extensions by CoffeeChaton/vscode-ahk-outline';

export function showTimeSpend(path: string, timeStart: number): void {
  const startSub = Math.max(path.lastIndexOf('/') + 1, path.lastIndexOf('\\') + 1);

  const timeSpend = config.displayTime ? `${Date.now() - timeStart} ms` : '';
  const name = config.displayFileName ? path.substring(startSub, path.length) : '';

  statusBarItem.text = `$(ruby)${version}${timeSpend}${name}`;
  statusBarItem.color = '#9F8A4E';
  //  TODO statusBarItem.command
  // statusBarItem.command = 'projectManager.listProjects';
  statusBarItem.show(); // FIXME
  //  statusBarItem.dispose();//
  // vscode.window.showInformationMessage(timeSpend);
  // vscode.window.showWarningMessage(timeSpend);
  // const a = vscode.window.createOutputChannel(version);
  // a.show();
  // a.appendLine(timeSpend);
  // console.log(timeSpend);
  // vscode.window.setStatusBarMessage(timeSpend);
}
