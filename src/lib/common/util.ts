import * as vscode from 'vscode';
import * as babylon from '@babel/parser';
import traverse from '@babel/traverse';

const { window, Position } = vscode;

export interface IPosition {
  line: number;
  column: number;
}

export interface ILoc {
  start: IPosition;
  end: IPosition;
  name: string;
}

export interface IImportDeclarations {
  source: {
    value: string;
  };
  specifiers: Array<{
    loc: ILoc;
    local: {
      name: string;
    };
    imported: {
      name: string;
    };
  }>;
  loc: ILoc;
}

export async function getImportDeclarations(content: string): Promise<IImportDeclarations[]> {
  const importDeclarations: IImportDeclarations[] = [];

  try {
    const ast = babylon.parse(content, {
      allowImportExportEverywhere: true,
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });
    // @ts-ignore
    traverse(ast, {
      ImportDeclaration: ({ node }: any) => {
        importDeclarations.push(node as any);
      },
    });
  } catch (error) {
    // ignore error
  }
  console.log(importDeclarations);
  return importDeclarations;
}

interface IImportInfos {
    position: vscode.Position;
    declarations: IImportDeclarations[];
}

export async function getImportInfos(text: string): Promise<IImportInfos> {
    const importDeclarations: IImportDeclarations[] = await getImportDeclarations(text);
  
    const { length } = importDeclarations;
    let position;
    if (length) {
      position = new Position(importDeclarations[length - 1].loc.end.line, 0);
    } else {
      position = new Position(0, 0);
    }
    return { position, declarations: importDeclarations };
  }
