
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
// This method is called when your extension is activated 
// Your extension is activated the very first time the command is executed 

/**
 * @param {vscode.ExtensionContext} context 
 * Kallas när extensionen aktiveras EN gång 
 * @author David Lindberg 
 * @last_update 2024-03-27
 */
function activate(context) {
	// Remind the user to practice keyboard shortcuts
	let lastShown = context.globalState.get('lastShown');
	let currentDate = new Date().toISOString().split('T')[0];
	if (lastShown !== currentDate) {

		vscode.window.showInformationMessage('Remember to learn some new keyboard shortcuts today :)');
		context.globalState.update('lastShown', currentDate);
	}

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let keyboardShortcuts = vscode.commands.registerCommand('first-test.keyboardShortcuts', function () {
		// Create and show a new webview
		const panel = vscode.window.createWebviewPanel(
			'keyboardShortcuts', // Identifies the type of the webview. Used internally
			'Keyboard Shortcuts for Beginners', // Title of the panel displayed to the user
			vscode.ViewColumn.One, // Editor column to show the new webview panel in.
			{
				enableScripts: true,
				localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
			}
		);


		// Array of picture names
		const pictureNames = ['autoIndent', 'commentCode', 'copy', 'copyLine', 'cut', 'find', 'findReplace', 'moveLine', 'multiselectWord', 'paste', 'redo', 'renameComponent', 'selectAll', 'selectCharacters', 'selectWords', 'uncommentCode', 'undo', 'wordWrap'];

		// Create a map of the picture names and their URIs
		const pictureMap = {};
		for (const pictureName of pictureNames) {
			const uri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'media', `${pictureName}.gif`)));
			pictureMap[pictureName] = uri;
		}

		// Read the HTML file
		const htmlPath = path.join(context.extensionPath, 'webview/index.html');
		let htmlContent = fs.readFileSync(htmlPath, 'utf8');

		// Replace the placeholders with the actual image URIs
		for (const pictureName in pictureMap) {
			const placeholder = '%' + pictureName + '%';
			htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), pictureMap[pictureName]);
		}

		// And set its HTML content
		panel.webview.html = htmlContent;

	});

	context.subscriptions.push(keyboardShortcuts);

	

}



// This method is called when your extension is deactivated
function deactivate() {

}

module.exports = {
	activate,
	deactivate
}
