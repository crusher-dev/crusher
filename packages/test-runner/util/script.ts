//@ts-ignore
const matchImportRegex = new RegExp(/import(\s+\S+\s+)from\s+(\S+);/gm);
const packageNameRequireMatchRegex = new RegExp(
  /require\((['"])([\w-]+)\1\)/gm
);
// Also replaces playwright with playwright-aws-lambda
export function replaceImportWithRequire(script: string) {
  if (!script) {
    return script;
  }
  return script.replace(matchImportRegex, function (
    match,
    variableName,
    packageName
  ) {
    if (!variableName || !packageName) {
      return match;
    }
    return `const ${variableName} = require(${packageName});`;
  });
}

export function replaceWithPlaywrightWrapper(script: string, platform = null) {
  return script.replace(packageNameRequireMatchRegex, function (
    match: string,
    quote: string,
    packageName: string
  ) {
    if (packageName === "playwright") {
      return `require(${quote}../wrapper/playwright${quote}).boot(platform)`;
    } else if (packageName === "playwright-video") {
      return `require(${quote}../wrapper/playwright${quote})`;
    }
    return `require(${quote}${packageName}${quote})`;
  });
}
