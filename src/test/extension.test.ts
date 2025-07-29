import * as assert from 'assert';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { setTimeout } from 'node:timers/promises';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

const tmp = mkdtempSync(join(tmpdir(), 'undiff-'));

suite('Extension Test Suite', () => {
	test('Sample test', async () => {
		try {
			const fn = join(tmp, 'foo.txt');
			writeFileSync(fn, `\
+ foo
+bar
+	baz
boo
- foo
-bar
-	baz
boo
`);
			const w = await vscode.window.showTextDocument(vscode.Uri.file(fn));
			const {document} = w;
			w.selection = new vscode.Selection(
				document.positionAt(0),
				document.positionAt(document.getText().length)
			);
			// await setTimeout(100);
			await vscode.commands.executeCommand("undiff.unPlus");
			await vscode.commands.executeCommand("undiff.unMinus");
			assert.equal(document.getText(), `\
 foo
bar
	baz
boo
 foo
bar
	baz
boo
`);
		} finally {
			rmSync(tmp, { recursive: true });
		}
	});
});

