import * as vscode from 'vscode';
import * as fs from 'fs';
import { list } from '../resource/turing/list';
import { edit } from '../resource/turing/edit';

const { window, Uri: URI, workspace } = vscode;

export const insertFile = async () => {
    const uri = await window.showSaveDialog({
        defaultUri: workspace.workspaceFolders ? workspace.workspaceFolders[0].uri : URI.file('/'),
        filters: {
            // vue: ['vue'], // 文件类型过滤
        },
    });
    if (uri) {
        if (fs.existsSync(uri.path)) {
            window.showWarningMessage('已存在该名称文件夹');
        } else {
            await fs.mkdirSync(uri.path);
            await fs.writeFileSync(`${uri.path}/list.vue`, list);
            await fs.writeFileSync(`${uri.path}/edit.vue`, edit);
            window.showInformationMessage('插入成功');
        }
    } else {
        window.showWarningMessage('请选择文件路径');
    }
};