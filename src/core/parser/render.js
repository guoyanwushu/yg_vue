function render() {

}

var string = 'hello, i come from {{myCountry}}, my name is {{myName.toUpperCase()}}'
// 怎么把上面那句话解析出来， 并且要触发属性访问

var reg = /\{\{(.+?)\}\}/g
var match, tokens = [], lastIndex = 0
while (match = reg.exec(string)) {
  var index = match.index
  if (index>lastIndex) {
    tokens.push(JSON.stringify(string.substring(lastIndex, index)))
  }
  tokens.push(match[1]);
  lastIndex = index + match[0].length
}
if (lastIndex < string.length) {
  tokens.push(JSON.stringify(string.substring(lastIndex)))
}
var results = tokens.join('+')
var d = new Function("return "+results);



