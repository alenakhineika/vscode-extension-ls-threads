// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { activate as activateLanguageServer, executeSleep, cancelSleep } from './language/client';
import { ProgressLocation } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "vscode-extension-ls-threads" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'extension.helloWorld',
    async () => {
      return new Promise(async (resolve) => {
        // Show a running progress in the notification area with support for cancellation
        await vscode.window.withProgress({
          location: ProgressLocation.Notification,
          title: 'Searching...',
          cancellable: true
        }, async (progress, token) => {
          token.onCancellationRequested(async () => {
            await cancelSleep();

            return resolve(false);
          });

          await executeSleep();

          return resolve(true);
        });
      });
    }
  );

  activateLanguageServer(context);
  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
