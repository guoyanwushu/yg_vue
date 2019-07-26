function parser(html, options) {
  var tagStartReg = /^<([a-z]+)\s*([^>/]*)\/?>/;
  var  tagEndReg = /^<\/([a-z0-9]+)\s*>/
  var  tagStart = /<([a-z]+)\s*([^>/]*)\/?>/;
  var  tagEnd = /<\/([a-z0-9]+)\s*>/
  var commentReg = /^<!\-\-.*\-\->/
  var doctypeReg = /^<!Doctype [^>]+>/i
  var attrs = /\s*([\w\:\@]+)\s*=\s*["|'](.*)["|']\s*/
  var match;
  var stack = [];
  var elementQuene = [];
  while (html) {
    // 刚好匹配上起始标签
    var textEnd = template.indexOf('<');
    if (textEnd == 0) {
      // 要考虑异常， 比如<!-- 条件注释  <!Doctype 文档说明
      if (commentReg.test(html)) {
        var commentEndIndex = html.indexOf('-->')
        html = html.substring(commentEndIndex+3);
        continue
      }
      // 剔除掉文档节点
      var doctypeMatch = html.match(doctypeReg)
      if (doctypeMatch) {
        html = html.substring(doctypeMatch[0].length);
        continue
      }
      var startMatch = html.match(tagStartReg);
      if (startMatch) {
        // 解析开始标签
        continue
      }
      var endMatch = html.match(tagEndReg);
      if (endMatch) {
        // 解析结束标签
        continue
      }

    }
    else if (textEnd >= 0) {
      var rest, next;
      rest = html.substring(textEnd);
      while (!tagStartReg.test(rest) &&
          !tagEndReg.test(rest) &&
          !commentReg.test(rest) &&
          !doctypeReg.test(rest)) {
        next = rest.indexOf('<', 1)
        if (next < -1) {
          // 说明< 后面的都是text了
          textEnd = html.length;
          break
        }
        textEnd = textEnd + next;
        rest = rest.substring(next)
      }
      text = html.substring(0, textEnd);
      html = html.substring(textEnd);
      continue
    }
    else if (textEnd < 0) {
      // <都没找到， 那百分百不是标签了， 后面的都是纯文本
      text = html;
      html = ''
    }

  }
  return elementQuene
}
function parseStartTag(startMatch) {
  var tagName = startMatch[1] || ''
  var datas = startMatch[2] || ''
}


