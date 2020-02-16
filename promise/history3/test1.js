const Promise = require('./promise1')
const fs = require('fs')

function read(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      // if (err) return reject(err)
      // resolve(data)
      reject(11)
    })
  })
}
// promise的链式调用
// 如果是一个promise就不是普通值
// 如果then方法中的成功或失败 执行的时候发生错误会走下一个then的失败的回调
// 如果then方法返回了一个失败的promise他会走外层的失败的回调

const p = read('./data1.text').then(data => {
  console.log('data', data)
  // return data
  // return new Promise((resolve, reject) => {
  //   reject('err')
  // })
  throw new Error('555')
}, (err) => {
  // console.log('err', err)
  throw 100
})

p.then(data => {
  console.log('data1', data)
  throw new Error('666')
}, err => {
  console.log('err1', err)
})

