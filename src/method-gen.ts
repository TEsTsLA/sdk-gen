import { ClassDeclaration, MethodDeclarationStructure, OptionalKind } from "ts-morph";

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
export default function (method: OptionalKind<MethodDeclarationStructure>, DtoClassList: Array<ClassDeclaration>): OptionalKind<MethodDeclarationStructure> {

  return method
}