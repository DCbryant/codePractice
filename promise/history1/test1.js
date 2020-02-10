const Promise = require('./promise1')

const p = new Promise((resolve, reject) => { //executor
  // pending
  console.log('executor')
  // 成功了就不能失败，失败同理
  // resolve('success')
  reject('error')
})

// 每个promise的实例都有一个then方法
p.then((value) => { // fulfilled
  console.log('成功', value)
}, (reason) => { // rejected
  console.log('失败', reason)
})

