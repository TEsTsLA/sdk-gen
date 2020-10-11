#!/bin/bash node
import program from "commander";
import { ClassDeclaration, Project } from "ts-morph";
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
const ControllerClassList: Array<ClassDeclaration> = []
const DtoClassList: Array<ClassDeclaration> = []
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
const ApiStruct = ApiControlClassDeclaration.getStructure()
console.log(ApiStruct);

// ControllerClassList.map(cls => {
//   const structure = cls.getStructure()
//   structure.methods = structure.methods.map(method => {
//     const decorators = method.decorators || [];
//     const is = (name: string) => {
//       return decorators.some((dec) => dec.name === name);
//     };
//     const getOptions = (name: string) => {
//       const decorator = decorators.find((dec) => dec.name === name);
//       let args: any[] = ["'/'"];
//       if (
//         decorator &&
//         Array.isArray(decorator.arguments) &&
//         decorator.arguments.length > 0
//       ) {
//         args = decorator.arguments
//           .map((arg) => {
//             if (typeof arg === "string") {
//               return arg;
//             }
//             return undefined;
//           })
//           .filter((it) => !!it);
//       }
//       const options = args.join(",");
//       return {
//         options
//       };
//     };
//     const create = () => {
//       if (is("Get")) {
//         const options = getOptions("Get");
//         return `return http.get(${options.options})`;
//       } else if (is("Post")) {
//         const options = getOptions("Post");
//         return `return http.post(${options.options})`;
//       } else if (is("Put")) {
//         const options = getOptions("Put");
//         return `return http.put(${options.options})`;
//       } else if (is("Delete")) {
//         const options = getOptions("Delete");
//         return `return http.delete(${options.options})`;
//       } else if (is("Head")) {
//         const options = getOptions("Head");
//         return `return http.head(${options.options})`;
//       } else if (is("Patch")) {
//         const options = getOptions("Patch");
//         return `return http.patch(${options.options})`;
//       } else if (is("Options")) {
//         const options = getOptions("Options");
//         return `return http.options(${options.options})`;
//       }
//       return `throw new Error('500')`;
//     };
//     method.decorators = []
//     method.statements = [create()]
//     method.parameters = (method.parameters || []).map((par) => {
//       par.decorators = [];
//       return par;
//     });
//     return method
//   })
// })

ApiStruct.methods?.concat([])
distProject.saveSync()