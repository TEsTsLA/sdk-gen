#!/bin/bash node
import program from "commander";
import { ClassDeclaration, Project, ClassDeclarationStructure, StructureKind, Node, VariableDeclarationKind } from "ts-morph";
import ts from 'typescript'
import { join } from "path";
import { ensureDirSync, rmdirSync } from "fs-extra";
// 根目录
const root = process.cwd();
const SdkConf = require(join(root, 'sdk.config.json'))
const output = join(root, SdkConf.outDir);
// 包文件
const pkg = require("../package.json");
// 参数
const args = process.argv;
program.version(pkg.version);
program.parse(args);
rmdirSync(output, {
  recursive: true,
});
ensureDirSync(output);
// 项目 Project
const project = new Project({
  tsConfigFilePath: join(root, "tsconfig.json"),
});
const sourcefiles = project.getSourceFiles();
// 输入sdk Project
const distProject = new Project();

const outIndexFile = distProject.createSourceFile(join(output, "index.ts"))

const outControlFile = distProject.createSourceFile(join(output, "control.ts"))
outControlFile.addStatements(`import http from '${SdkConf.httpMod}';`);

const outDtoFile = distProject.createSourceFile(join(output, 'dto.ts'))

const ControllerClassList: Array<ClassDeclaration> = []
const DtoClassList: Array<ClassDeclaration> = []

const MethodMap = ["GET", "POST", "PUT", "DELETE"]
function formatMethod(Arguments: Node<ts.Node>[]): Array<string> {
  if (!Arguments.length) {
    return []
  }
  let basePath = Arguments[0]?.getText()
  basePath = basePath.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\"|\'|\,|\<|\.|\>|\?]/g, "");
  return basePath.split('/').filter(i => !!i && i.trim()) ?? []
}
function getMethodStatments(paths: Array<string>, methodName: string) {
  return `return http.${methodName.toLowerCase()}('/${paths.join('/')}')`
}

sourcefiles.forEach(sourcefile => {
  sourcefile.fixUnusedIdentifiers()
  sourcefile.getClasses().forEach(clazzDec => {
    clazzDec.getDecorators().forEach(decorator => {
      if (decorator.getFullName() === "Controller") {
        const newClazzDec = outControlFile.addClass({
          name: clazzDec.getName(),
          docs: clazzDec.getJsDocs().map(item => item.getStructure())
        })
        newClazzDec.setIsExported(true)
        const controlPath = formatMethod(decorator.getArguments())
        clazzDec.getInstanceMethods().forEach(methodDec => {
          methodDec.getDecorators().forEach(dec => {
            const methodName = MethodMap.find(name => name === dec.getFullName().toUpperCase())
            if (methodName) {
              const methodPath = formatMethod(dec.getArguments())
              const parameters = methodDec.getParameters().map(item => {
                item.getDecorators().forEach(item => item.remove())
                return item
              })
              const returnType = methodDec.getReturnType()
              const path = returnType.getAliasSymbol().getDeclarations()[0].getSourceFile().getFilePath()
              returnType.getText()
              newClazzDec.addMethod({
                name: methodDec.getName(),
                docs: methodDec.getJsDocs().map(item => item.getStructure()),
                statements: getMethodStatments(controlPath.concat(methodPath), methodName),
                parameters: parameters.map(item => item.getStructure()),
                returnType: returnType.getText()
              })
            }
          })
        })

        ControllerClassList.push(newClazzDec)
      }
    })
  })
})
// make export index
ControllerClassList.forEach(clazzDec => {
  outIndexFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: `$${clazzDec.getName()}`,
      initializer: `new ${clazzDec.getName()}()`,
    }],
    isExported: true
  })
})

// last action
outDtoFile.fixMissingImports()
outControlFile.fixMissingImports()
outIndexFile.fixMissingImports()
distProject.saveSync()