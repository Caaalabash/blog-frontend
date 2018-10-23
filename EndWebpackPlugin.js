class EndWebpackPlugin {
  constructor(doneCallback) {
    this.doneCallback = doneCallback
  }
  apply(compiler) {
    compiler.hooks.done.tapAsync('prepare-upload',stats => {
      this.doneCallback(stats)
    })
  }
}
module.exports = EndWebpackPlugin