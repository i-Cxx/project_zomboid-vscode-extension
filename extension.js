const vscode = require('vscode');

function activate(context) {
	console.log('Congratulations, your extension "pzmode" is now active!');

	// Hello World Command
	const disposable = vscode.commands.registerCommand('pzmode.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from pzmode!');
	});
	context.subscriptions.push(disposable);

	// Mod-Struktur Command (wie vorher)
	const createModDisposable = vscode.commands.registerCommand('pzmode.createModStructure', async () => {
		// Noch zu implementieren oder aus vorherigem Beispiel einfügen
	});
	context.subscriptions.push(createModDisposable);

	// Beispiel-Datei erstellen (.pz, .ini, .json, .lua, .info)
	const createSampleFileDisposable = vscode.commands.registerCommand('pzmode.createSampleFile', async () => {
		const fileType = await vscode.window.showQuickPick(
			['pz', 'ini', 'json', 'lua', 'mod.info'],
			{ placeHolder: 'Welchen Dateityp möchtest du erstellen?' }
		);
		if (!fileType) {
			vscode.window.showErrorMessage('Kein Dateityp ausgewählt.');
			return;
		}

		const folders = vscode.workspace.workspaceFolders;
		if (!folders) {
			vscode.window.showErrorMessage('Kein Workspace geöffnet.');
			return;
		}
		const rootUri = folders[0].uri;

		const suggestedName = fileType === 'mod.info' ? 'mod.info' : `example.${fileType}`;
		const fileName = await vscode.window.showInputBox({
			prompt: `Dateiname für die neue ${fileType}-Datei`,
			value: suggestedName
		});
		if (!fileName) {
			vscode.window.showErrorMessage('Kein Dateiname angegeben.');
			return;
		}

		const fileUri = vscode.Uri.joinPath(rootUri, fileName);

		let content = '';
		switch(fileType) {
			case 'pz':
				content = `// Beispiel .pz Datei\nStart = {\n    Name = "Startpunkt"\n}\n`;
				break;
			case 'ini':
				content = `; Beispiel .ini Datei\n[General]\nName=Project Zomboid Mod\nVersion=1.0\n`;
				break;
			case 'json':
				content = `{\n  "name": "pz-mod",\n  "version": "1.0",\n  "description": "Beispiel JSON für PZ"\n}\n`;
				break;
			case 'lua':
				content = `-- Beispiel Lua Script\nprint("Hallo Project Zomboid")\n`;
				break;
			case 'mod.info':
				content = `name=MeineMod\nid=meinemod\nposter=poster.png\nicon=icon.png\nauthor=Dein Name\ndescription=Beschreibung hier\nrequire=Base\n`;
				break;
			default:
				content = '';
		}

		try {
			const encoder = new TextEncoder();
			await vscode.workspace.fs.writeFile(fileUri, encoder.encode(content));
			const doc = await vscode.workspace.openTextDocument(fileUri);
			await vscode.window.showTextDocument(doc);
			vscode.window.showInformationMessage(`${fileType.toUpperCase()} Datei '${fileName}' erstellt.`);
		} catch (err) {
			vscode.window.showErrorMessage(`Fehler beim Erstellen der Datei: ${err.message}`);
		}
	});
	context.subscriptions.push(createSampleFileDisposable);

	// Autocomplete + Hover für .pz
	const keywords = ['Start', 'End', 'Zombie', 'Player', 'Server'];
	const completionProvider = vscode.languages.registerCompletionItemProvider('pz', {
		provideCompletionItems() {
			return keywords.map(word => new vscode.CompletionItem(word, vscode.CompletionItemKind.Keyword));
		}
	});
	context.subscriptions.push(completionProvider);

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
