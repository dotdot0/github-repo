const vscode = require('vscode')
const axios = require('axios')

/**
 * @param {vscode.ExtensionContext} context
 */


function activate(context) {

	console.log('Congratulations, your extension "hello" is now active!');

	//Hello World Command
	let disposable = vscode.commands.registerCommand('hello.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World from Github Repos!');
	});

	//Main Command
	let disp1 = vscode.commands.registerCommand('hello.repo',async () => {

		let name = await vscode.window.showInputBox({
			  placeHolder: "Github User Name",
  			prompt: "Github username of the user you want to see repos of",
		});

		//Checking If Name Is Empty
		if (name === '') {
			vscode.window.showErrorMessage("Name Is Required!")
		}

		//If name is not undefined
		else if (name !== undefined) {
			const response = await axios.get(` https://api.github.com/users/${name}/repos`)

			//Converting Data For Show Quick Function Format
			const userRepos = response.data.map((repo) => {
				return {
					label: repo.name,
					detail: repo.description,
					url: repo.svn_url
				}
			});

			//Show Quick Pick 
			const repo = await vscode.window.showQuickPick(userRepos, {
				matchOnDetail: true
			})
			vscode.env.openExternal(repo.url)
		}
	})

	context.subscriptions.push(disposable, disp1);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
