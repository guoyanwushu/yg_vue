const funA = (i,timeountMS) => new Promise((resolve,reject) => {
  if(i > 3){
    setTimeout(function(){resolve(i++);}, timeountMS);
  }else{
    reject(0);
  }
});

const funB = (i,timeountMS) => new Promise((resolve) => {
  setTimeout(function(){resolve(++i);}, timeountMS);
});

// 写出console.log的输出，（有时间间隔，请写明，如:1秒间隔，2秒间隔）
(async () => {
  for (var i = 0; i <= 5; i++) {
    await funA(i,1000).then(
      r=>{
        console.log('a=',r);
        return funB(r,2000);
      },
      j=>{
        console.log('b=',j);
      }).then(r=>{
      console.log('c=',r);
    });
    console.log('i=',i);
  }
})();
