import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
  CancellationTokenSource
} from 'vscode-languageclient';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  // The server is implemented in node
  let serverModule = context.asAbsolutePath(
    path.join('out', 'language', 'server.js')
  );

  // The debug options for the server
  // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
  let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  let serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions
    }
  };

  // Options to control the language client
  let clientOptions: LanguageClientOptions = {
    // Register the server for plain text documents
    documentSelector: [
      { scheme: 'untitled', language: 'plaintext' },
      { scheme: 'file', language: 'plaintext' }
    ],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
    }
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    'languageServerExample',
    'Language Server Example',
    serverOptions,
    clientOptions
  );

  // Start the client. This will also launch the server
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }

  return client.stop();
}

let source: CancellationTokenSource;

export function executeSleep(): Promise<any> {
  return client.onReady().then(() => {
    // Instantiate a new CancellationTokenSource object
    // that generates a cancellation token for each run of a playground
    source = new CancellationTokenSource();

    // Send a request with a cancellation token
    // to the language server server to execute a long-running operation
    return client.sendRequest('executeSleep', source.token);
  });
}

export function cancelSleep(): Promise<any> {
  return new Promise((resolve) => {
    // Send a request for cancellation. As a result
    // the associated CancellationToken will be notified of the cancellation,
    // the onCancellationRequested event will be fired,
    // and isCancellationRequested will return true.
    source?.cancel();

    return resolve(true);
  });
}
