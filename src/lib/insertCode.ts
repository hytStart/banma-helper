import * as vscode from 'vscode';

// const http = require('http');
// const path = require('path');
// const fs = require('fs');
const clipboardy = require('clipboardy');

const { window, Position } = vscode;
export default class Tangram {
    private static tpl: { [key: string]: string } = {
        select: `
    <bm-select v-model="value" placeholder="请选择">
        <bm-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </bm-option>
    </bm-select>`,
        input: `<bm-input v-model="input" placeholder="请输入内容"></bm-input>`,
        button: ` <bm-button @click="change">默认按钮</bm-button>`,
        card: `
    <bm-card class="box-card">
        <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <bm-button style="float: right; padding: 3px 0" type="text">操作按钮</bm-button>
        </div>
        <div v-for="o in 4" :key="o" class="text item">
        {{'列表内容 ' + o }}
        </div>
    </bm-card>`,
        checkbox: `<bm-checkbox v-model="checked">备选项</bm-checkbox>`,
    };
    public static async insertCode() {
        const options = [
            {
                label: 'select',
            },
            {
                label: 'input',
            },
            {
                label: 'button',
            },
            {
                label: 'card',
            },
            {
                label: 'checkbox',
            },
            {
                label: 'form',
            },
        ];
        // 打开vscode的选择器
        const action = await window.showQuickPick(options);
        if (typeof action === 'object') {
            const tpl = this.getTpl(action.label);
            this.writeText(tpl);
        }
    }
    private static getTpl(name: string): string {
        // const url = 'http://dev.sankuai.com/code/repo-detail/BM/banma_fe_tangram_ui/file/detail?codeArea=mcode&sourceRepo=BM%2Fbanma_fe_tangram_ui&target=refs%2Fheads%2Fmaster&targetRepo=BM%2Fbanma_fe_tangram_ui&branch=refs%2Fheads%2Fmaster&path=src%2Fbasic%2Fselect%2Fdemo%2Fselect.md'
        // readRemoteFile(url, (err, buffer) => {
        //     console.log('####', buffer.toString('utf8'));
        // });
        // const filePath = path.join(process.cwd(), `/VscodeExtenionHelloWorld/src/mdMock/${name}.md`);
        // const res = fs.readFileSync(filePath, 'utf8');
    
        // return res.match(/<template>((?!<\/template)([\s\S]))*<\/template>/)[0];
        return this.tpl[name];
    };

    /**
     * 插入内容进入文本或者复制到粘贴板
     * @param compiledString 
     */
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

/**
 * 读取远程文件
 *
 * @param {String} url
 * @param {Function} cb
 *   - {Error} err
 *   - {Buffer} buf
 */
//  function readRemoteFile (url, cb) {
//     var callback = function () {
//       // 回调函数，避免重复调用
//       callback = function () {};
//       cb.apply(null, arguments);
//     };
  
//     var req = http.get(url, function (res) {
//       var b = [];
//       res.on('data', function (c) {
//         b.push(c);
//       });
//       res.on('end', function () {
//         callback(null, Buffer.concat(b));
//       });
//       res.on('error', callback);
//     });
//     req.on('error', callback);
// }