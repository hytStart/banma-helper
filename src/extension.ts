// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Tangram from './lib/insertCode';
import { insertFile } from './lib/insertFile';
import { gitOp } from './lib/gitOp';
import Notice from './lib/notice';
import Request from './lib/request';
import { DocumentHoverProvider } from './lib/tangramDoc';
import ReactPro from './lib/reactPro';
import OpenOrigin from './lib/openOrigin';
import Strong from './lib/strong';

const schedule = require('node-schedule');

const jobs: any[] = [];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "banma-helper" is now active!');
    const registrationHover = vscode.languages.registerHoverProvider('vue', new DocumentHoverProvider);
	// ones提醒定时任务
	const timer = Notice.schedule();
	jobs.push(timer);
	const strongTimer = Strong.schedule();
	jobs.push(strongTimer);

	ReactPro.onChangeActiveTextEditor(context);
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('banma-helper.vue', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		Tangram.insertCode();
	});

	const turing = vscode.commands.registerCommand('banma-helper.turing', () => {
		insertFile();
	});
	const git = vscode.commands.registerCommand('banma-helper.git', () => {
		gitOp();
	});
	const notice = vscode.commands.registerCommand('banma-helper.notice', () => {
		Notice.send();
	});
	const request = vscode.commands.registerCommand('banma-helper.request', () => {
		Request.showSelect();
	});
	const reactPro = vscode.commands.registerCommand('banma-helper.reactpro', () => {
		ReactPro.showMaterials(context);
	});

	const openOrigin = vscode.commands.registerCommand('banma-helper.openorigin', () => {
		OpenOrigin.gotoGitlab(context);
	});

	const openpr = vscode.commands.registerCommand('banma-helper.openpr', () => {
		OpenOrigin.openpr(context);
	});

	const strong = vscode.commands.registerCommand('banma-helper.strong', () => {
		Strong.send();
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(turing);
	context.subscriptions.push(git);
	context.subscriptions.push(notice);
	context.subscriptions.push(request);
    context.subscriptions.push(registrationHover);
	context.subscriptions.push(strong);
}

// this method is called when your extension is deactivated
export function deactivate() {
    // 清空任务
	jobs.forEach(job => {
		if (job instanceof schedule.Job) {
			job.cancel();
		}
	});
}
