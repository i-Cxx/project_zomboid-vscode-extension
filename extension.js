// The module 'vscode' contains the VS Code extensibility API
const vscode = require('vscode');

/**
 * This method is called when your extension is activated
 * Your extension is activated the very first time the command is executed
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "pzmode" is now active!');

	// Register the command defined in package.json
	const disposable = vscode.commands.registerCommand('pzmode.helloWorld', () => {
		// Show an information message every time the command is executed
		vscode.window.showInformationMessage('Hello World from pzmode!');
	});

	context.subscriptions.push(disposable);
}

/**
 * This method is called when your extension is deactivated
 */
function deactivate() {}

module.exports = {
	activate,
	deactivate
};
