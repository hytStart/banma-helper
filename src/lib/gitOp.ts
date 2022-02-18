import * as vscode from 'vscode';
import * as SimpleGit from 'simple-git/promise';

const { window, workspace, env, Uri: URI } = vscode;

export const gitOp = async () => {
    const options: vscode.InputBoxOptions = {
        prompt: "Label: ",
        placeHolder: "请输入commit信息"
    };
    if (workspace.workspaceFolders) {
        const git: SimpleGit.SimpleGit = SimpleGit(workspace.workspaceFolders[0].uri.path);
        const value = await window.showInputBox(options);
        if (!value) {
            throw new Error('请输入commit信息');
        };
        try {
    		vscode.window.setStatusBarMessage('git工作流提交中，请耐心等待', 2000);
            await git.add('.');
            const { commit } = await git.commit(value.trim());
            const branch = await git.revparse(['--abbrev-ref', 'HEAD']);
            if (!commit) {
                // 如果没有更改内容，推测是develop, qa merge后的，需要直接push，所以没有 throw
                if (!['develop', 'qa', 'dev'].includes(branch)) {
                    throw new Error('commit有问题');
                }
            }
            await git.pull('origin', branch);
            await git.push('origin', branch);
            if (['develop', 'qa', 'dev'].includes(branch)) {
                window.showInformationMessage('push成功，正在打开皮卡丘');
                const name = workspace.workspaceFolders[0].uri.path.split('/').reverse()[0];
                env.openExternal(URI.parse(`http://pikachu.bmp.sankuai.com/fe/task#/deploy/${name}`));
            } else {
                window.showInformationMessage('push成功');
            }
        } catch(e) {
            window.showErrorMessage(e.message);
        }
    }
};