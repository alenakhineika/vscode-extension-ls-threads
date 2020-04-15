# A VSCode extension with the language server and child threads

This project is an example of usage the VSCode Language Server and Node Worker Threads that configured together allow managing long-running operations with a possibility to cancel them.

## Usage

- Clone the project for the repository
- Navigate to the project's folder
- `npm i`
- `npm run compile`
- Press `F5` to run the extension
- Open a text file to activate an extension
- Run the `Hello World` command from the Command Palette (`⇧⌘P`) to start a long-running operation
- Use a `Cancel` button on the process modal to terminate the operation

*Note:* If you changed Fn keys settings on your laptop, or for some other reason F5 button does not run your extension, use the `Run Extension` icon in the VSCode activity bar.

## The language server

The VSCode language server follows the [Microsoft LSP specification](https://microsoft.github.io/language-server-protocol/specification) and allows to perform long-running operations in a background process to ensure that VSCode's performance remains unaffected.

### Client

The language client runs next to UI code and uses [vscode-languageclient](https://github.com/microsoft/vscode-languageserver-node/tree/master/client) for JSON RPC over IPC.

Use `console.log()` for printing debug information in the Debug Console of the extension.

### Server

The language server runs as a separate Node process using [vscode-languageserver](https://github.com/microsoft/vscode-languageserver-node/tree/master/server)

Use `connection.console.log()` for printing debug information in the `Language Server Example` Output Channel of the server.

## Worker threads

Node's worker threads are used to isolate long-running operations and to be able to terminate infinite loops. The design of the language server does not allow us to interact with the server directly. Only the client of the language server can send requests to the server. And in case of infinite loops, the server becomes unresponsive and can't be stopped by the client.

## Cancellation tokens

The `CancellationTokenSource` class listens for cancelation events in the language server.
