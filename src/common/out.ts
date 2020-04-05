/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */

// 'user strict';

import * as vscode from 'vscode';
import { OutputChannel } from 'vscode';

export class Out {
  public static log(value: Object) {
    if (!this.channel) {
      this.channel = vscode.window.createOutputChannel('AHK');
    }
    this.channel.show(true);
    this.channel.appendLine(`${value}`);
  }

  private static channel: OutputChannel;
}
