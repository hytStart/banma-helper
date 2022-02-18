import {
  window,
  commands,
  Disposable,
  Uri,
  CancellationToken,
  workspace,
  CompletionItemProvider,
  ProviderResult,
  TextDocument,
  Position,
  CompletionItem,
  CompletionList,
  CompletionItemKind,
  SnippetString,
  Range,
  HoverProvider,
  Hover,
  Selection,
  TextLine,
  TextEditor,
} from "vscode";
import Documents from './documents';
import DocumentsAttr from './documents-attr';


// 文档通过 hover 形式查看
export class DocumentHoverProvider implements HoverProvider {
  // 获取属性所属标签
  static getTag(document: TextDocument, position: Position): String {
    let line = position.line;
    let tagName = "";

    while (line > 0 && !tagName) {
      let lineInfo: TextLine = document.lineAt(line);
      let text = lineInfo.text.trim();
      // 本行则获取光标位置前文本
      if (line === position.line) {
        text = text.substring(0, position.character);
      }
      let txtArr = text.match(/<[^(>/)]+/gim);
      if (txtArr) {
        for (let i = txtArr.length - 1; i >= 0; i--) {
          if (txtArr[i][0] === "<" && txtArr[i][1] !== "/") {
            if (txtArr[i].indexOf(" ") !== -1) {
              tagName = txtArr[i].replace(/^<(\S*)(\s.*|\s*)/gi, "$1");
            } else {
              tagName = txtArr[i].replace(/^<(.*)/gi, "$1");
            }
            break;
          }
        }
      }
      --line;
    }
    return tagName;
  }
  provideHover(
    document: TextDocument,
    position: Position,
    token: CancellationToken
  ): ProviderResult<import("vscode").Hover> {
    const line = document.lineAt(position.line);
    const textSplite = [" ", "<", ">", '"', "'", ".", "\\", "=", ":"];
    // 通过前后字符串拼接成选择文本
    let posIndex = position.character;
    let textMeta = line.text.substr(posIndex, 1);
    let selectText = "";
    // 前向获取符合要求的字符串
    while (
      textSplite.indexOf(textMeta) === -1 &&
      posIndex <= line.text.length
    ) {
      selectText += textMeta;
      textMeta = line.text.substr(++posIndex, 1);
    }
    // 往后获取符合要求的字符串
    posIndex = position.character - 1;
    textMeta = line.text.substr(posIndex, 1);
    while (textSplite.indexOf(textMeta) === -1 && posIndex > 0) {
      selectText = textMeta + selectText;
      textMeta = line.text.substr(--posIndex, 1);
    }
    textMeta = line.text.substr(posIndex, 1);

    // tag标签便利
    if (Documents[selectText]) {
      return new Hover(Documents[selectText]);
    }

    // 在不是标签元素情况下才获取标签名称
    if (textMeta !== "<") {
      let tagName = DocumentHoverProvider.getTag(document, position);
      if (tagName && DocumentsAttr[tagName + "/" + selectText]) {
        return new Hover(DocumentsAttr[tagName + "/" + selectText]);
      }
    }

    return null;
  }
}
