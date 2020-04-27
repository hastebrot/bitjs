const path = require("path");
const WorkerPlugin = require("worker-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bitjs.js",
    chunkFilename: "bitjs.[name].js",
    library: "bitjs",
    libraryTarget: "umd",
  },
  plugins: [
    new WorkerPlugin({
      // disable warnings about "window" breaking HMR.
      globalObject: false,
    }),
  ],
  devtool: "source-map",
  mode: "production",
};
