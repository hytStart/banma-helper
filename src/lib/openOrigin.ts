import * as vscode from 'vscode';
import * as SimpleGit from 'simple-git/promise';

const { window, Uri: URI, env, workspace } = vscode;
  

export default class ReactRro {
    public static gotoGitlab(context: vscode.ExtensionContext) {
        if (window.activeTextEditor) {
            try {
                const path = window.activeTextEditor.document.fileName; // 本地路径
                const workPath = path.match(/banma_[\s\S]*/g) || []; // 匹配banma_路径
                const workPathArray = workPath[0].split('/'); // 路径切割
                const workName = workPathArray[0]; // 项目
                workPathArray.shift();
                const urlPath = workPathArray.join('/'); // 其余路径
                const url = `http://dev.sankuai.com/code/repo-detail/bm/${workName}/file/detail?branch=refs%2Fheads%2Fmaster&path=${encodeURIComponent(urlPath)}`
                env.openExternal(URI.parse(url));
            } catch (e) {
                window.showErrorMessage('打开失败');
            }
        }
    }
    public static async openpr(context: vscode.ExtensionContext) {
        if (window.activeTextEditor && workspace.workspaceFolders) {
            try {
                const path = window.activeTextEditor.document.fileName; // 本地路径
                const workPath = path.match(/banma_[\s\S]*/g) || []; // 匹配banma_路径
                const workPathArray = workPath[0].split('/'); // 路径切割
                const workName = workPathArray[0]; // 项目名字
                const gitPath = path.match(/[\s\S]*banma_[\w]*\//g) || [] // 项目根路径
                const git: SimpleGit.SimpleGit = SimpleGit(gitPath[0]);
                const branch = await git.revparse(['--abbrev-ref', 'HEAD']);
                const url = `http://dev.sankuai.com/code/repo-detail/bm/${workName}/pr/create?source=refs/heads/${branch}&sourceRepo=bm/${workName}&target=refs/heads/master&targetRepo=bm/${workName}`
                env.openExternal(URI.parse(url));
            } catch (e) {
                window.showErrorMessage('打开失败');
            }
        } else {
            window.showErrorMessage('pr创建失败');
        }
    }
};