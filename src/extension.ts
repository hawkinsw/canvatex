// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, you have support for rendering LaTeX for Canvas!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('canvatex.RenderCanvasMd', async () => {
		if (!vscode.window.activeTextEditor) {
			vscode.window.showInformationMessage('Cannot export when there is not an active text editor.');
			return;
		}
		const rawMarkdown = vscode.window.activeTextEditor?.document.getText()
		if (!rawMarkdown) {
			// Empty text. Don't do anything!
			vscode.window.showInformationMessage('No markdown found. Nothing copied to the clipboard.');
			return;
		}
		const settings = vscode.workspace.getConfiguration('canvatex')
		const canvasUrl: string | undefined = settings.get("canvasUrl")
		if (canvasUrl === undefined || canvasUrl === "") {
			vscode.window.showInformationMessage('No Canvas URL set. Nothing copied to the clipboard.');
			return
		}
		await vscode.env.clipboard.writeText(rawMarkdown?.replace(/(\$.*?\$)/g, (match) => {
			const latex = match.substring(1, match.length - 1)
			return `<img class="equation_image" title="${latex}" src="https://${canvasUrl}/equation_images/${latex}?scale=1" alt="LaTeX: ${latex}" data-equation-content="${latex}" />`
		}))
		vscode.window.showInformationMessage('Updated markdown has been copied to the clipboard.');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
