const Promise = require('./promise1')

const promise = new Promise((resolve, reject) => {
  resolve(1);
})
// 循环引用
let promise2 = promise.then((result) => {
  // console.log(promise2, "promise2")
  return promise2
})

promise2.then((result) => {

}, (reason) => {
  console.log(reason, "error")
})