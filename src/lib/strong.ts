import * as vscode from 'vscode';

const schedule = require('node-schedule');

export default class Strong {
	private static panel: vscode.WebviewPanel | undefined;
	public static schedule() {
		// 每天下午三点半
		const timer = schedule.scheduleJob('50 38 10 * * *',()=>{
            const matchConfig = vscode.workspace.getConfiguration().get('banma-helper.strong');
            if (matchConfig === 'on') {
                vscode.window.showInformationMessage('5s后进行提肛运动哦，请提前做好准备！');
                setTimeout(() => {
                    this.send();
                }, 5000);
            }
		});
		return timer;
		// timer.cancel();
	}
    public static send() {
		if (this.panel) {
			this.panel.webview.html = this.generatePage();
            this.panel.onDidDispose(() => {
                this.panel = undefined;
            });
		} else {
			this.panel = vscode.window.createWebviewPanel("hyt", "提肛运动", vscode.ViewColumn.One, {
                enableScripts: true,
                retainContextWhenHidden: true,
            });
            this.panel.webview.html = this.generatePage();
            this.panel.onDidDispose(() => {
                this.panel = undefined;
            });
		}
	}
	public static generatePage(): string {
		return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Document</title>
			<style>
				.desc {
                    color: #fff;
                    font-size: 20px;
				}
                button {
                    color: #fff;
                    font-size: 20px;
                    background-color: #252526;
                    border: none;
                    cursor: pointer;
                }
                .vi-conatiner {
                    padding-top: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                }
                .img-base {
                    width: 300px;
                    height: 500px;
                }
			</style>
		</head>
		<body style="background-color: #15c27a;">
            <div class="vi-conatiner">
                <div class="desc">
                    有规律的上提、放松肛门，促进局部血液循环。
                </div>
                <button class="desc" onclick="start()">
                    点击开始哦
                </button>
                <div style="margin-top: 10px">
                    <img class="img-stop img-base" src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ea60bfe91c14a98bd098d19e5616a3a~tplv-k3u1fbpfcp-watermark.image" alt="">
                </div>
            </div>
		</body>
        <script>
            const img = document.getElementsByClassName('img-stop')[0]
            function start() {
                img.src = "https://p1.meituan.net/paotui/kyvcpbt0f1p.gif"
            }
        </script>
		</html>`;
	}
};