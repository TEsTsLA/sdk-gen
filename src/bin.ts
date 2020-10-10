#!/bin/bash node
import program from "commander";
import { Project } from "ts-morph";
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
const project = new Project({
  tsConfigFilePath: join(root, "tsconfig.json"),
});
const sourcefiles = project.getSourceFiles();
const distProject = new Project();
const ControllerClassList = []
const DtoClassList = []
sourcefiles.forEach(sourcefile => {
  const classes = sourcefile.getClasses();
  classes.forEach(cls => {
    const decorators = cls.getDecorators();
    const hasControllerDecorator = decorators.some((dec) => {
      const decoratorName = dec.getFullName();
      return decoratorName === "Controller";
    });
    const hasDtoDecorator = decorators.some((dec) => {
      const decoratorName = dec.getFullName();
      return decoratorName === "Dto";
    });
    if (hasControllerDecorator) {
      ControllerClassList.push(cls)
    }
    if (hasDtoDecorator) {
      DtoClassList.push(cls)
    }
  })
})

const outputControlFile = distProject.createSourceFile(join(output, "index.ts"))
const outputDtoFile = distProject.createSourceFile(join(output, 'dto.ts'))
outputControlFile.addStatements(`import http from '${SdkConf.httpMod}';`);
outputControlFile.addStatements(`import 'dto.ts';`);
const ApiControlClassDeclaration = outputControlFile.addClass({
  name: "ApiControl"
})
ControllerClassList.map(cls => {
  
})
