function parser(template, options) {
  const tagStartReg = /^<([a-z]+)\s*([^>/]*)\/?>/;
  const tagEndReg = /^<\/([a-z0-9]+)\s*>/
  const tagStart = /<([a-z]+)\s*([^>/]*)\/?>/;
  const tagEnd = /<\/([a-z0-9]+)\s*>/
  let match;
  let domsQuene = [];
  let elementQuene = [];
  while (template) {
    // 刚好匹配上起始标签
    if (match = tagStartReg.exec(template)) {
      template = template.substring(match[0].length);
      let domObj = {
        tag: match[1],
        type: 'element',
        datas: match[2],
        children: []
      }
      elementQuene.push(domObj)
      if (domsQuene.length) {
        domsQuene[domsQuene.length - 1].children.push(domObj);
      }
      domsQuene.push(domObj)
      continue;
    }
    // 刚好匹配上结束标签
    if (match = tagEndReg.exec(template)) {
      if (domsQuene[domsQuene.length - 1].tag == match[1]) {
        domsQuene.splice(domsQuene.length - 1, 1)
      }
      template = template.substring(match[0].length);
      continue;
    }
    // 中间还有内容部分， 这个部分即不是起始标签， 也不是结束标签， 那就是文本标签喽, 文本也算是dom的一种类型，和元素标签一样挂在父节点的children里面就行了
    var match1 = tagStart.exec(template);
    var match2 = tagEnd.exec(template);
    var match1index = match1 ? match1.index : template.length;
    var match2index = match2 ? match2.index : 0;
    var textEndindex = 0 || Math.min(match1index, match2index);
    var textObj = {
      type: 'text',
      data: textEndindex > 0 ? template.substring(0, textEndindex) : template.substring(0)
    }
    if (domsQuene.length) {
      domsQuene[domsQuene.length - 1].children.push(textObj);
    }
    template = textEndindex > 0 ? template.substring(textEndindex) : ''
  }
  return elementQuene
}


