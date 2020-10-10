#!/bin/bash node
import program from "commander";
import { Project } from "ts-morph";
import { join } from "path";
import { ensureDirSync, rmdirSync } from "fs-extra";
import SdkConf from '../sdk.config.json';
const pkg = require("../package.json");
program.version(pkg.version);
const args = process.argv;
program.parse(args);
const root = process.cwd();
const output = join(root, SdkConf.outDir);
rmdirSync(output, {
  recursive: true,
});
ensureDirSync(output);
const project = new Project({
  tsConfigFilePath: join(root, "tsconfig.json"),
});
const sourcefiles = project.getSourceFiles();
const distProject = new Project();
sourcefiles.forEach((sourcefile) => {
  const classes = sourcefile.getClasses();
  const hasController = classes.some((cls) => {
    const decorators = cls.getDecorators();
    const hasControllerDecorator = decorators.some((dec) => {
      const decoratorName = dec.getFullName();
      return decoratorName === "Controller";
    });
    if (hasControllerDecorator) {
      // 生成sdk
      return true;
    }
    return false;
  });
  if (hasController) {
    const outputFile = distProject.createSourceFile(
      join(output, "index.ts")
    );
    outputFile.addStatements(`import http from '${SdkConf.httpMod}';`);
    classes.map((cls) => {
      const structure = cls.getStructure();
      console.log(structure.name);
      
      structure.name = 'Api'
      structure.decorators = [];
      structure.methods = (structure.methods || []).map((method) => {
        const decorators = method.decorators || [];
        const parameters = method.parameters || [];
        const is = (name: string) => {
          return decorators.some((dec) => dec.name === name);
        };
        const getOptions = (name: string) => {
          const decorator = decorators.find((dec) => dec.name === name);
          let args: any[] = ["'/'"];
          if (
            decorator &&
            Array.isArray(decorator.arguments) &&
            decorator.arguments.length > 0
          ) {
            args = decorator.arguments
              .map((arg) => {
                if (typeof arg === "string") {
                  return arg;
                }
                return undefined;
              })
              .filter((it) => !!it);
          }
          const options = args.join(",");
          return {
            options
          };
        };
        const create = () => {
          if (is("Get")) {
            const options = getOptions("Get");
            return `return http.get(${options.options})`;
          } else if (is("Post")) {
            const options = getOptions("Post");
            return `return http.post(${options.options})`;
          } else if (is("Put")) {
            const options = getOptions("Put");
            return `return http.put(${options.options})`;
          } else if (is("Delete")) {
            const options = getOptions("Delete");
            return `return http.delete(${options.options})`;
          } else if (is("Head")) {
            const options = getOptions("Head");
            return `return http.head(${options.options})`;
          } else if (is("Patch")) {
            const options = getOptions("Patch");
            return `return http.patch(${options.options})`;
          } else if (is("Options")) {
            const options = getOptions("Options");
            return `return http.options(${options.options})`;
          }
          return `throw new Error('500')`;
        };
        method.decorators = [];
        method.statements = [create()];
        method.parameters = (method.parameters || []).map((par) => {
          par.decorators = [];
          return par;
        });
        return method;
      });
      outputFile.addClass(structure);
    });
    distProject.saveSync();
    debugger;
  }
});
