import typescript from "typescript";

const code = "const test: number = 1 + 2";
const transpiledCode = typescript.transpileModule(code, {}).outputText;
console.log(transpiledCode);