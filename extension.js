const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "pzmode" is now active!');

	// Command registrieren (wie gehabt)
	const disposable = vscode.commands.registerCommand('pzmode.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from pzmode!');
	});
	context.subscriptions.push(disposable);

	// Keywords für Autocomplete und Hover
	const keywords = ['Start', 'End', 'Zombie', 'Player', 'Server'];

	// Autocomplete Provider für .pz Dateien
	const completionProvider = vscode.languages.registerCompletionItemProvider('pz', {
		provideCompletionItems() {
			return keywords.map(word => new vscode.CompletionItem(word, vscode.CompletionItemKind.Keyword));
		}
	});
	context.subscriptions.push(completionProvider);

	// Hover Provider für .pz Dateien
	const hoverProvider = vscode.languages.registerHoverProvider('pz', {
		provideHover(document, position) {
			const range = document.getWordRangeAtPosition(position);
			const word = document.getText(range);
			const hoverMessages = {
				Start: 'Startpunkt des Spiels',
				End: 'Ende des Spiels',
				Zombie: 'Gegner im Spiel',
				Player: 'Spieler-Charakter',
				Server: 'Server-Konfiguration'
			};
			if (hoverMessages[word]) {
				return new vscode.Hover(hoverMessages[word]);
			}
		}
	});
	context.subscriptions.push(hoverProvider);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
};
