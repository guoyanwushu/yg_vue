import {parse, renderFunc} from "./src/core/parser/html_parser";
const _htmlTemp = '<div id="test" :name="cname">hello world, my name is {{name.toUpperCase()}}</div>'
const vNodes = parse(_htmlTemp)

console.log(renderFunc(vNodes, {cname: '王大锤', name: '王小锤'}, document.getElementById('#div')))