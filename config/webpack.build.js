import webpack_config from "./webpack.config.js";
import path from "node:path";
import { URL } from "node:url";

const __dirname = new URL(".", import.meta.url).pathname;

export default Object.assign({}, webpack_config, {
  mode: "production",
  devtool: "hidden-source-map",
  entry: path.resolve(__dirname, "../temp/index.js"),
  output: {
    path: path.resolve(__dirname, "../build"),
    filename: "index.js",
    library: "CssSelectorGenerator",
    libraryTarget: "umd",
  },
});
