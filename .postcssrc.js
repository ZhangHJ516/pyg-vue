// https://github.com/michael-ciniawsky/postcss-load-config
// 用js代码处理样式文件，工具是postcssrc,该文件是该工具的配置文件
module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {}
  }
}
