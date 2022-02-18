import * as vscode from 'vscode';

const schedule = require('node-schedule');

export default class Notice {
	private static panel: vscode.WebviewPanel | undefined;
	public static schedule() {
		// 每周五下午三点
		const timer = schedule.scheduleJob('0 0 15 * * 5',()=>{
			this.send();
		});
		return timer;
		// timer.cancel();
	}
    public static send() {
		if (this.panel) {
			this.panel.webview.html = this.generateOnes();
            this.panel.onDidDispose(() => {
                this.panel = undefined;
            });
		} else {
			this.panel = vscode.window.createWebviewPanel("hyt", "Ones工时提醒", vscode.ViewColumn.One, {
                enableScripts: true,
                retainContextWhenHidden: true,
            });
            this.panel.webview.html = this.generateOnes();
            this.panel.onDidDispose(() => {
                this.panel = undefined;
            });
		}
	}
	public static generateOnes(): string {
		const love = this.getLove();
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
					margin-top: 100px;
					color: #fff;
				}
				.img-container {
					margin-top: 20px;
					position: relative;
				}
				.img-container div {
					position: absolute;
					width: 100%;
					top: 20px;
					font-size: 20px;
					color: #000;
					text-align: center;
				}
			</style>
		</head>
		<body>
			<div class="desc">
				小伙伴们，又到周末啦，大家记得填报工时，更新<a target="_blank" href="https://ones.sankuai.com/ones/user/userIndex?workbenchTab=workTime">ones</a>状态啊
			</div>
			<a target="_blank" href="https://ones.sankuai.com/ones/user/userIndex?workbenchTab=workTime">https://ones.sankuai.com/ones/user/userIndex?workbenchTab=workTime</a>
			<div class="img-container">
				<div>${love}</div>
				<img src="https://ftp.bmp.ovh/imgs/2021/04/c07ef9fedda5ae4f.jpeg" alt="">
			</div>
		</body>
		</html>`;
	}
	public static getLove(): string {
		const arr = [
			'消费者每次花钱，都是在为他想要的生活投票',
			'坚持做正确的事，而不是容易的事',
			'既往不恋，纵情向前',
			'对未来越有信心，对现在越有耐心',
			'每天前进三十公里',
			'我不会，但可以学',
			'三高三低：高品质，低价格；高效率，低成本；高科技，低毛利',
			'重要的是和什么样的人，一起做什么样的事',
			'少谈一点颠覆，多谈一点创新',
			'判断服务是否足够好的标准是：我们是否愿意推荐给自己的家人',
			'多数人为了逃避思考，愿意做任何事情',
			'两心：以客户为中心，长期有耐心',
			'Think long term，Think big picture',
			'建设比见证更重要',
			'苦练基本功',
			'做有积累的事',
		];
		const msg = arr[Math.floor(Math.random() * 16)] || 'Live Better, Eat Better';
		return msg;
	}
};