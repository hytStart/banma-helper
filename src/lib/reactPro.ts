import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getImportInfos } from './common/util';
import { TableList } from '../resource/reactPro/tableList';

const { window, Uri: URI, ViewColumn, Position } = vscode;

function getNonce(): string {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
	  text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
function originResourceProcess(url: string) {
    return URI.file(url).with({ scheme: 'vscode-resource' });
}

export function getImportTemplate(name: string, source: string): string {
    return `import ${name} from '${source}';\n`;
}
  
export function getTagTemplate(name: string): string {
    return `<${name} /> \n`;
}
  

export default class ReactRro {
	private static panel: vscode.WebviewPanel | undefined;
    private static activeTextEditorId: string;
    // 改变的时候获取
    public static onChangeActiveTextEditor(context: vscode.ExtensionContext) {
        vscode.window.onDidChangeActiveTextEditor(
			(editor) => {
				if (editor) {
					const { fsPath } = editor.document.uri;
					const isJSXFile = fsPath.match(/^.*\.(jsx?|tsx)$/g);
					vscode.commands.executeCommand('setContext', 'banma-helper:rightClick', isJSXFile);
					
					// save active text editor id
					// const { id } = editor as any;
					this.setLastActiveTextEditorId(fsPath);
				}
			},
			null,
			context.subscriptions,
        );
    }
    // 物料webview
    public static showMaterials(context: vscode.ExtensionContext) {
        const { extensionPath, subscriptions } = context;
        if (this.panel) {
          	this.panel.webview.html = this.generateTpl(extensionPath);
			this.panel.onDidDispose(() => {
				this.panel = undefined;
			});
        } else {
			const layout = { orientation: 0, groups: [{ size: 0.7 }, { size: 0.3 }] };
			const viewColumn = ViewColumn.Beside;
          	this.panel = vscode.window.createWebviewPanel(
				"ReactPro",
				"ReactPro物料",
				{
					viewColumn,
					preserveFocus: true,
				}, 
				{
					enableScripts: true,
					retainContextWhenHidden: true,
				}
			);
			this.panel.webview.html = this.generateTpl(extensionPath);
			this.panel.webview.onDidReceiveMessage(message => {
				const { id } = message;
				this.handleFile(id);
			}, undefined, subscriptions);
			this.panel.onDidDispose(() => {
				this.panel = undefined;
			});
			vscode.commands.executeCommand('vscode.setEditorLayout', layout);
        }
	  }
    // 切换tab重置
    public static setLastActiveTextEditorId(id: string) {
        this.activeTextEditorId = id;
    }
    // 最后一次活动的texteditor
    public static getLastAcitveTextEditor() {
        const { visibleTextEditors } = window;
        const activeTextEditor = visibleTextEditors.find(item => item.document.uri.fsPath === this.activeTextEditorId);
        return activeTextEditor;
    }
    // 根据最后一次activeTextEditor, 插入代码及文件
    private static async handleFile(fileId: number) {
        const fileMap: { [key: string]: string } = {
            1: 'TableList',
            2: 'FormEdit',
        };
        const name = fileMap[fileId.toString()];
        const activeTextEditor = this.getLastAcitveTextEditor();

        if (activeTextEditor) {
            const { position: importDeclarationPosition } = await getImportInfos(activeTextEditor.document.getText());
            activeTextEditor.edit(async (editBuilder) => {
                // ast插入import
                editBuilder.insert(importDeclarationPosition, getImportTemplate(name, `./components/${name}`));
                const { selection } = activeTextEditor;
                const position = new Position(selection.active.line, selection.active.character);
                // 插入组件标签
                editBuilder.insert(position, getTagTemplate(name));
            });
            const { fsPath } = activeTextEditor.document.uri;
            // 读取路径
            const pathLu = path.dirname(fsPath);
            await fs.mkdirSync(`${pathLu}/components`);
            await fs.writeFileSync(`${pathLu}/components/${name}.tsx`, TableList);
            window.showInformationMessage('插入成功');
        } else {
            window.showWarningMessage('请插入到相关文件中');
        }
    }
    // 静态html
	public static generateTpl(extensionPath: string): string {
		const basePath = path.join(extensionPath, 'web/dist');
		const nonce = getNonce();
		const scriptPath = `${basePath}/app.bundle.js`;
		const scriptUri = originResourceProcess(scriptPath);
		const cssPath = `${basePath}/css/index.css`;
		const cssUri = originResourceProcess(cssPath);
		return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Output Management</title>
  </head>
  <body>
    <div id="root"></div>
  <script src="${scriptUri}"></script></body>
</html>
`;
	}
};