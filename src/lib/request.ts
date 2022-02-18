import * as vscode from 'vscode';
const clipboardy = require('clipboardy');

const { window, Position } = vscode;

enum Code {
    AjaxGet,
    AjaxPost,
    HttpGet,
    HttpPost,
};
interface RequestMap {
    [Code.AjaxGet]: string;
    [Code.AjaxPost]: string;
    [Code.HttpGet]: string;
    [Code.HttpPost]: string;
}

export default class Request {
    private static requestMap: RequestMap = {
        [Code.HttpGet]: `
const params = {}
const url = \`\${this.PATH_PREFIX.AI}\${this.API.TOOL.MSGBOX.FETCH_MSG}\`
this.$http.get(url, { params }).then(result => {
    const { code, msg, data } = result
    if (code === 0) {
        this.$message.success('success')
    } else {
        this.$message.error(msg)
    }
}).catch((err) => {
    this.$message.error(err)
})`,
        [Code.HttpPost]: `
const params = {}
const url = \`\${this.PATH_PREFIX.AI}\${this.API.TOOL.MSGBOX.FETCH_MSG}\`
this.$http.post(url, { ...params }).then(result => {
    const { code, msg, data } = result
    if (code === 0) {
        this.$message.success('success')
    } else {
        this.$message.error(msg)
    }
}).catch((err) => {
    this.$message.error(err)
})`,
        [Code.AjaxGet]: `
const params = {}
const url = '/test'
$.ajax({
    url,
    type: 'GET',
    datatype: 'json',
    data: { ...params }
}).done(res => {
    const { code, data, message } = res || {}
    if (code === 0) {
        BmSuccess('success')
    } else {
        BmWarning(message)
    }
}).fail(err => {
    BmWarning(err)
})`,
        [Code.AjaxPost]: `
const params = {}
const url = '/test'
$.ajax({
    url,
    type: 'POST',
    datatype: 'json',
    data: { ...params }
}).done(res => {
    const { code, data, message } = res || {}
    if (code === 0) {
        BmSuccess('success')
    } else {
        BmWarning(message)
    }
}).fail(err => {
    BmWarning(err)
})`,
    };
    public static async showSelect() {
        const options = [
            { code: Code.HttpGet, label: 'Http Get' },
            { code: Code.HttpPost, label: 'Http Post' },
            { code: Code.AjaxGet, label: 'Ajax Get' },
            { code: Code.AjaxPost, label: 'Ajax Post' }
        ];
        const action = await window.showQuickPick(options);
        if (typeof action === 'object') {
            const tpl = this.getTpl(action.code);
            this.writeText(tpl);
        }
    }
    private static getTpl(code: Code): string {
        return this.requestMap[code];
    }
    private static writeText(compiledString: string): void {
        // 插入字符串逻辑
        const {
            activeTextEditor
        } = window;
        // 插入到当前光标所在编辑框
        if (activeTextEditor) {
            activeTextEditor.edit((editBuilder) => {
                const position = new Position(activeTextEditor.selection.active.line, activeTextEditor.selection.active.character);
                editBuilder.insert(position, compiledString);
            });
        } else {
            // 复制到粘贴板
            clipboardy.write(compiledString);
            window.showWarningMessage('插入失败，已自动复制代码片');
        }
    };
}