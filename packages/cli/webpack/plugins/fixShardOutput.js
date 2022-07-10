const { Compilation, sources } = require('webpack');

class FixSharedOutputPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('FixSharedOutput', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'FixSharedOutput',
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        () => {
          // get the file main.js
          const file = compilation.getAsset('./src/shared.js');
          // console.log("File is", file.source.source());
          // update main.js with new content
          compilation.updateAsset(
            './src/shared.js',
            new sources.RawSource(file.source.source().replace('module.exports = __webpack_exports__;', 'module.exports = __webpack_require__;'))
          );
        }
      );
    });
  }
}

module.exports = { FixSharedOutputPlugin };