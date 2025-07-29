import * as vscode from 'vscode';

async function removeInSelection(re: RegExp): Promise<void> {
	const {activeTextEditor} = vscode.window;
	if (!activeTextEditor) {
		return;
	}

	await activeTextEditor.edit(b => {
		const {selection} = activeTextEditor;
		const cur = activeTextEditor.document.getText(selection);
		const fixed = cur.replace(re, '');
		b.replace(selection, fixed);
	});
}

export function activate(context: vscode.ExtensionContext) {

	const unPlus = vscode.commands.registerCommand('undiff.unPlus', () => {
		return removeInSelection(/^\+/gm);
	});
	const unMinus = vscode.commands.registerCommand('undiff.unMinus', () => {
		return removeInSelection(/^-/gm);
	});

	context.subscriptions.push(unPlus, unMinus);
}

// This method is called when your extension is deactivated
export function deactivate() {}
