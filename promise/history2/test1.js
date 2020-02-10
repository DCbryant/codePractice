const Promise = require('./promise1')
const fs = require('fs')

const p = new Promise((resolve, reject) => { //executor
  // fs.readFile是异步，没有立即调用resolve或者reject，因此此时状态还是pending
  fs.readFile('./data1.text', 'utf8', (err, data) => {
    if(err) return reject(err)

    resolve(data)
  })
})

// 每个promise的实例都有一个then方法
// promise有多个状态，如果成功会让成功的函数依次执行
// 如果失败会让失败的函数依次执行

p.then((value) => { // fulfilled
  console.log('成功', value)
}, (reason) => { // rejected
  console.log('失败', reason)
})

